import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as idTools from 'id-tools';
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
import { MTrader, SendMessage } from 'generated/prisma';
import generateOtp from 'src/custom/utils/generate.otp';
import { CurrencyService } from 'src/custom/utils/currency.md';

@Injectable()
export class AuthService {
    public constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly currencyService: CurrencyService
    ) {}
    
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
        return await this.jwtService.signAsync(payload);
    }

    public async register(details: TRegisterDetails) {
        const { email, phone, enterpriseName, password } = details;
        this.phoneOrEmail(phone, email);

        const existingUser = await this.prismaService.mTrader.findFirst({
            where: {
                OR: [ { email }, { phone } ]
            }
        });
        if (existingUser) 
            throw new BadRequestException('User with this phone or email already exists');

        const id = idTools.generateUlid();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.prismaService.mTrader.create({
            data: {
                id,
                email,
                phone,
                enterpriseName,
                password: hashedPassword,
                lastLogin: new Date()
            }
        });

        let sendMessageType: SendMessage;
        if(email) 
            sendMessageType = SendMessage.Email;
        else if (phone)
            sendMessageType = SendMessage.Phone;
        else
            sendMessageType = SendMessage.Email;

        // initializing the settings
        await this.prismaService.mTraderSettings.create({
            data: {
                traderId: id,
                enterpriseDescription: '',
                logoUrl: '',
                logo_PublicId: '',
                evaluationPeriod: 7,
                deleteSoldStockAfterEvaluationPeriod: false,
                ussdCode: '',
                sendMessage: sendMessageType,
                name: enterpriseName
            }
        });

        // creating a stock
        await this.prismaService.mStock.create({
            data: {
                id: idTools.generateUlid(),
                traderId: id,
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
                OR: [ { email }, { phone } ]
            }
        });
        if (!user) 
            throw new BadRequestException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) 
            throw new BadRequestException('Invalid credentials');

        return await this.prismaService.mTrader.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
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

    public async getOnboarding(id: string) {
        const settings = await this.prismaService.mTraderSettings.findUnique({ where: { traderId: id } });
        if (!settings) 
            throw new BadRequestException('Trader onboarding settings not found');
        return settings;
    }

    public async onboarding(details: TOnboardingDetails, id: string) {
        const { 
            enterpriseDescription, 
            logoUrl, logo_PublicId, 
            evaluationPeriod, 
            deleteSoldStockAfterEvaluationPeriod, 
            ussdCode, 
            sendMessage,
            currency
        } = details;

        try {
            const updateData: Partial<{
                enterpriseDescription: string;
                logoUrl: string;
                logo_PublicId: string;
                evaluationPeriod: number;
                deleteSoldStockAfterEvaluationPeriod: boolean;
                ussdCode: string;
                sendMessage: SendMessage;
                currency: string;
            }> = {};

            if (enterpriseDescription) updateData.enterpriseDescription = enterpriseDescription;
            if (logoUrl) updateData.logoUrl = logoUrl;
            if (logo_PublicId) updateData.logo_PublicId = logo_PublicId;
            if (evaluationPeriod) updateData.evaluationPeriod = evaluationPeriod;
            if (deleteSoldStockAfterEvaluationPeriod != undefined) updateData.deleteSoldStockAfterEvaluationPeriod = deleteSoldStockAfterEvaluationPeriod;
            if (ussdCode) updateData.ussdCode = ussdCode;
            if (sendMessage != undefined) updateData.sendMessage = sendMessage;
            if (currency) {
                if(!this.currencyService.isValidCurrency(currency))
                    throw new BadRequestException('Invalid currency code');
                updateData.currency = currency;
            }

            const settings = await this.prismaService.mTraderSettings.update({
                where: { traderId: id }, 
                data: updateData
            });
    
            return settings;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    throw new Error('User not found');
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
                OR: [ { email }, { phone } ].filter(Boolean) as any
            },
        });

        if (!user) 
            throw new BadRequestException('User not found');

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

        return otp;
    }

    public async verifyOtp(details: TVerifyOtpDetails) {
        const { email, phone, otp, isPasswordReset } = details;

        await this.phoneOrEmail(phone, email, false);
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await this.prismaService.mTrader.findFirst({
            where: {
                OR: [ { email }, { phone } ].filter(Boolean) as any,
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

        if(!isPasswordReset)
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
}
