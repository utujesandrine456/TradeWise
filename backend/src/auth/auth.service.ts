import { 
    BadRequestException, 
    Injectable, 
    UnauthorizedException 
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as idTools from 'id-tools';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { 
    TForgotPasswordDetails, 
    TJwtPayload, 
    TLoginTrader, 
    TOnboardingTrader, 
    TRegisterTrader, 
    TResetPasswordDetails, 
    TSendVerifyAccountDetails, 
    TUpdateTrader,
} from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { generateToken } from 'src/custom/utils/generateToken';
import { EmailService } from 'src/communication/email/email.service';

@Injectable()
export class AuthService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService
    ) {}

    private async generateJWTToken(payload: TJwtPayload) {
        const token = await this.jwtService.signAsync(payload);
        return token;
    }

    private checkEmailOrPhone(email?: string, phone?: string) {
        if(email && phone)
            throw new BadRequestException('Only one of email or phone is required');
        if(!email && !phone)
            throw new BadRequestException('Email or phone is required');
    }

    //for signup
    public async registerTrader(details: TRegisterTrader) {
        const { enterpriseName, email, phone, password } = details;
        this.checkEmailOrPhone(email, phone);

        //find if a trader(enterpriser) already exists
        const userExists =
            (await this.prismaService.mTrader.findUnique({
                where: { email },
            })) ||
            (await this.prismaService.mTrader.findUnique({
                where: { phone },
            }));

        if(userExists) {
            throw new BadRequestException('Trader already exists');
        }

        //hashing password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        //gen the id (ulid) using id-tools
        const id = idTools.generateUlid();
        const newTrader = await this.prismaService.mTrader.create({
            data: {
                id, 
                email: email || null,
                phone: phone || null,
                password: hashedPassword,
                enterpriseName,
            }
        });

        // creating an empty stock
        await this.prismaService.mStock.create({ data: { traderId: newTrader.id } });
        const token = await this.generateJWTToken({ 
            sub: newTrader.id,
            email: newTrader.email || undefined,
            phone: newTrader.phone || undefined 
        });

        return { newTrader, token };
    }

    public async login(details: TLoginTrader, res: Response) {
        const { email, password } = details;

        //find the trader in the db
        const loginTrader = await this.prismaService.mTrader.findUnique({ where: { email } });
        if(!loginTrader) 
            throw new BadRequestException('Invalid credentials');

        const isMatchPassword = await bcrypt.compare(password, loginTrader.password);
        if(!isMatchPassword) 
            throw new UnauthorizedException('Invalid credentials');

        const token = await this.generateJWTToken({ 
            sub: loginTrader.id, 
            email : loginTrader.email || undefined,
            phone: loginTrader.phone || undefined 
        });

        return { loginTrader, token };
    }

    // will handle both create and update onboarding
    public async onboarding(details: TOnboardingTrader, id: string) {
        const existingTrader = await this.prismaService.mTrader.findUnique({ where: { id } });
        if (!existingTrader)
            throw new Error(`Trader with id "${id}" not found`);

        const updateData: any = {};
        for (const [key, value] of Object.entries(details)) {
            if (value !== null && value !== undefined) {
                updateData[key] = value;
            }
        }

        return this.prismaService.mTraderSettings.update({ where: { traderId: id }, data: updateData });
    }

    public async getTraderSettings(id: string) {
        const existingTrader = await this.prismaService.mTrader.findUnique({ where: { id } });
        if (!existingTrader)
            throw new Error(`Trader with id "${id}" not found`);

        return this.prismaService.mTraderSettings.findUnique({ where: { traderId: id } });
    }
    
    public async updateProfile(details: TUpdateTrader, id: string) {
        const existingTrader = await this.prismaService.mTrader.findUnique({ where: { id } });

        if (!existingTrader)
            throw new Error(`Trader with id "${id}" not found`);

        let { password, ...rest } = details;
        if (password) {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            password = await bcrypt.hash(password, salt);
        }

        const updateData: any = {};
        for (const [key, value] of Object.entries(rest)) {
            if (value !== null && value !== undefined) {
            updateData[key] = value;
            }
        }
        if (password) updateData.password = password;

        return this.prismaService.mTrader.update({ where: { id }, data: updateData });
    }

    // token generation and verifications //

    public async forgetPassword(details: TForgotPasswordDetails) {
        const { email, phone } = details;
        this.checkEmailOrPhone(email, phone);

        const trader = await this.prismaService.mTrader.findFirst({ 
            where: { 
                OR: [
                    { email }, { phone }
                ]
            } 
        });
        if(!trader) 
            throw new BadRequestException('Invalid credentials');

        const token = generateToken(6);
        const hashedToken = await crypto.createHash('sha256').update(token).digest('hex');
        const newTrader = await this.prismaService.mTrader.update({ 
            where: { id: trader.id }, 
            data: { 
                resetPasswordToken: hashedToken,
                resetPasswordExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            } 
        });

        return { token, newTrader };
    }

    public async resetPassword(details: TResetPasswordDetails) {
        const { token, password } = details;
        const hashedToken = await crypto.createHash('sha256').update(token).digest('hex');
        const trader = await this.prismaService.mTrader.findFirst({ 
            where: { 
                resetPasswordToken: hashedToken,
                resetPasswordExpires: {
                    gte: new Date() // token must be less than or equal to the current date by 10 minutes
                }
            } 
        });

        if(!trader) 
            throw new BadRequestException('Invalid or expired token');
        
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds); // extra security
        const hashedPassword = await bcrypt.hash(password, salt);
        const newTrader = await this.prismaService.mTrader.update({ 
            where: { id: trader.id }, 
            data: { 
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            } 
        });
        
        return newTrader;
    }

    public async sendVerifyAccountToken(details: TSendVerifyAccountDetails) {
        const {email, phone} = details;
        this.checkEmailOrPhone(email, phone);

        const trader = await this.prismaService.mTrader.findFirst({ 
            where: { 
                OR: [
                    { email }, { phone }
                ]
            } 
        });
        if(!trader) 
            throw new BadRequestException('Invalid credentials');

        const token = generateToken(6);
        const hashedToken = await crypto.createHash('sha256').update(token).digest('hex');
        const newTrader = await this.prismaService.mTrader.update({ 
            where: { id: trader.id }, 
            data: { 
                verifyAccountToken: hashedToken,
                verifyAccountExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            } 
        });

        return { token, newTrader };
    }

    public async verifyAccount(token: string) {
        const hashedToken = await crypto.createHash('sha256').update(token).digest('hex');
        const trader = await this.prismaService.mTrader.findFirst({ 
            where: { 
                verifyAccountToken: hashedToken,
                verifyAccountExpires: {
                    gte: new Date() // token must be less than or equal to the current date by 10 minutes
                }
            } 
        });

        if(!trader) 
            throw new BadRequestException('Invalid or expired token');
        
        const newTrader = await this.prismaService.mTrader.update({ 
            where: { id: trader.id }, 
            data: { 
                verifyAccountToken: null,
                verifyAccountExpires: null
            } 
        });
        
        return newTrader;
    }
}
