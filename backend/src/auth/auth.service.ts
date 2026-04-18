import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
    IJwtPayload,
    TLoginDetails,
    TOnboardingDetails,
    TRegisterDetails,
    TResetPasswordDetails,
    TSendOtpDetails,
    TUpdateDetails,
    TVerifyOtpDetails,
} from './auth.types';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { MTrader } from 'generated/prisma';
import { EPaymentMethod } from 'src/graphql/circular-dependency';
import { SmsService } from 'src/communication/sms/sms.service';
import generateOtp from 'src/custom/utils/generate.otp';

@Injectable()
export class AuthService {
    public constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly smsService: SmsService
    ) { }

    private phoneOrEmail(phone?: string, email?: string, allowBoth = true) {
        if (!phone && !email)
            throw new BadRequestException('Either phone or email is required');
        if (phone && email && !allowBoth)
            throw new BadRequestException('Phone and email cannot be used together');
    }

    public async getProfile(id: string) {
        const user = await this.prismaService.mTrader.findUnique({ where: { id } });
        if (!user)
            throw new BadRequestException('User not found');
        return user;
    }

    public async generateToken(sub: string) {
        const payload: IJwtPayload = { sub, lastLoginAt: new Date() };
        return await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    }

    public async register(details: TRegisterDetails) {
        const { email, phone, enterpriseName, password } = details;
        this.phoneOrEmail(phone, email);

        const existingUser = await this.prismaService.mTrader.findFirst({
            where: {
                OR: [{ email }, { phone }]
            }
        });
        if (existingUser)
            throw new BadRequestException('User with this email already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.prismaService.mTrader.create({
            data: {
                email,
                phone,
                enterpriseName,
                password: hashedPassword,
                lastLogin: new Date()
            }
        });

        // initializing the settings
        await this.prismaService.mTraderSettings.create({
            data: {
                traderId: newUser.id,
                enterpriseDescription: '',
                name: enterpriseName
            }
        });

        // creating a stock
        await this.prismaService.mStock.create({
            data: {
                traderId: newUser.id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        return newUser;
    }

    public async login(details: TLoginDetails) {
        const { email, phone, password } = details;
        this.phoneOrEmail(phone, email, false);

        const user = await this.prismaService.mTrader.findFirst({
            where: {
                OR: [{ email }, { phone }]
            }
        });
        if (!user)
            throw new BadRequestException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new BadRequestException('Invalid credentials');

        const loginUser = await this.prismaService.mTrader.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        return loginUser;
    }

    public async update(details: TUpdateDetails, id: string) {
        let { email, phone, enterpriseName, password } = details;
        try {
            const updateData: Record<any, string> = {};
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updateData.password = hashedPassword;
            }
            if (email) updateData.email = email;
            if (phone) updateData.phone = phone;
            if (enterpriseName) updateData.enterpriseName = enterpriseName;

            const user = await this.prismaService.mTrader.update({
                where: { id },
                data: updateData
            });

            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new BadRequestException('Phone or email already exists');
                if (error.code === 'P2025')
                    throw new BadRequestException('User not found');
            }

            throw new InternalServerErrorException(error.message ?? "Something went wrong");
        }
    }

    public async sendOtp(details: TSendOtpDetails) {
        const { email, phone, isPasswordReset } = details;
        this.phoneOrEmail(phone, email, false);

        const otp = generateOtp();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
        const user = await this.prismaService.mTrader.findFirst({
            where: {
                OR: [{ email }, { phone }].filter(Boolean) as any
            },
        });

        if (!user)
            throw new BadRequestException(`User with this ${phone ? 'phone' : 'email'} not found`);

        let updateData: Partial<MTrader>;
        if (isPasswordReset) {
            updateData = {
                resetPasswordToken: hashedOtp,
                resetPasswordExpires: new Date(Date.now() + 10 * 60 * 1000)
            };
        } else {
            updateData = {
                verifyAccountToken: hashedOtp,
                verifyAccountExpires: new Date(Date.now() + 10 * 60 * 1000)
            };
        }

        await this.prismaService.mTrader.update({
            where: { id: user.id },
            data: updateData
        });

        if (phone) {
            if (isPasswordReset) {
                await this.smsService.sendPasswordResetOtp(phone, otp);
            } else {
                await this.smsService.sendOtp(phone, otp);
            }
        }

        return otp;
    }

    public async verifyOtp(details: TVerifyOtpDetails) {
        const { email, phone, otp, isPasswordReset } = details;

        await this.phoneOrEmail(phone, email, false);
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await this.prismaService.mTrader.findFirst({
            where: {
                OR: [{ email }, { phone }].filter(Boolean) as any,
                ...(isPasswordReset
                    ? { resetPasswordToken: hashedOtp }
                    : { verifyAccountToken: hashedOtp }
                ),
                ...(isPasswordReset
                    ? { resetPasswordExpires: { gte: new Date() } }
                    : { verifyAccountExpires: { gte: new Date() } }),
            },
        });

        if (!user)
            throw new BadRequestException('Invalid or expired OTP');

        // update the isVerified field
        if (!isPasswordReset) {
            await this.prismaService.mTrader.update({
                where: { id: user.id },
                data: { isVerified: true }
            });
        }

        if (!isPasswordReset)
            await this.clearOtp(user.id);

        return user;
    }

    private async clearOtp(id: string) {
        await this.prismaService.mTrader.update({
            where: { id },
            data: {
                verifyAccountToken: null,
                verifyAccountExpires: null,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });
    }

    public async resetPassword(details: TResetPasswordDetails, id: string) {
        const { password } = details;

        const user = await this.prismaService.mTrader.update({
            where: { id },
            data: {
                password: await bcrypt.hash(password, 10),
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        return user;
    }

    public async getOnboarding(id: string) {
        const settings = await this.prismaService.mTraderSettings.findUnique({ where: { traderId: id } });
        if (!settings)
            throw new BadRequestException('Trader onboarding settings not found');
        return settings;
    }

    public async onboarding(details: TOnboardingDetails, id: string) {
        const {
            enterpriseDescription,
            email,
            name,
            currency,
            businessType,
            industry,
            foundedYear,
            description,
            website,
            address,
            businessHours,
            phoneNumber,
            anualRevenue,
            numberOfEmployees,
            paymentMethod,
            targetMarket,
            competitors,
            goals,
        } = details;

        try {
            const updateData: Partial<{
                enterpriseDescription: string;
                name: string;
                currency: string;
                businessType: string;
                industry: string;
                foundedYear: number;
                description: string;
                website: string;
                address: string;
                businessHours: string;
                phoneNumber: string;
                anualRevenue: number;
                numberOfEmployees: number;
                paymentMethod: EPaymentMethod;
                targetMarket: string;
                competitors: string;
                goals: string;
            }> = {};

            if (enterpriseDescription) updateData.enterpriseDescription = enterpriseDescription;
            if (name) updateData.name = name;
            if (currency) updateData.currency = currency;
            if (businessType) updateData.businessType = businessType;
            if (industry) updateData.industry = industry;
            if (foundedYear) updateData.foundedYear = foundedYear;
            if (description) updateData.description = description;
            if (website) updateData.website = website;
            if (address) updateData.address = address;
            if (businessHours) updateData.businessHours = businessHours;
            if (phoneNumber) updateData.phoneNumber = phoneNumber;
            if (anualRevenue) updateData.anualRevenue = anualRevenue;
            if (numberOfEmployees) updateData.numberOfEmployees = numberOfEmployees;
            if (paymentMethod) updateData.paymentMethod = paymentMethod;
            if (targetMarket) updateData.targetMarket = targetMarket;
            if (competitors) updateData.competitors = competitors;
            if (goals) updateData.goals = goals;

            const settings = await this.prismaService.mTraderSettings.update({
                where: { traderId: id },
                data: updateData
            });

            if (email || name) {
                await this.update({ email, enterpriseName: name }, id);
            }

            return settings;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    throw new Error('User not found');
            }

            throw new InternalServerErrorException(error.message ?? "Something went wrong");
        }
    }

    public async getSettings(traderId: string) {
        try {
            const settings = await this.prismaService.mTraderSettings.findUnique({
                where: { traderId }
            });

            return settings;
        } catch (error) {
            throw new InternalServerErrorException(error.message ?? "Something went wrong");
        }
    }
}
