import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as idTools from 'id-tools';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TJwtPayload, TLoginTrader, TRegisterTrader, TUpdateTrader, VerifyAccountDetails } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { generateToken } from 'src/custom/utils/generateToken';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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

    //for signup
    public async registerTrader(details: TRegisterTrader) {
        const { enterpriseName, email, password } = details;

        //find if a trader(enterpriser) already exists
        const userExists = await this.prismaService.mTrader.findUnique({
            where: { email }
        });
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
                email, 
                password: hashedPassword,
                enterpriseName,
            }
        });

        // creating an empty stock
        await this.prismaService.mStock.create({ data: { traderId: newTrader.id } });
        // send email verification
        await this.sendVerifyAccountToken(email);
        const token = await this.generateJWTToken({ sub: newTrader.id, email: newTrader.email });

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

        const token = await this.generateJWTToken({ sub: loginTrader.id, email : loginTrader.email });

        return { loginTrader, token };
    }

    public async getProfile(id: string) {
        const profile = await this.prismaService.mTrader.findUnique({ where: { id } });
        
        if(!profile)
            throw new BadRequestException('Trader not found');
        
        return profile;
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

    public async forgotPassword(email: string) {
        const trader = await this.prismaService.mTrader.findUnique({ where: { email }});
        if(!trader) throw new BadRequestException('Email doesn\'t exist');

        const resetPasswordToken = generateToken();
        const resetPasswordHashedToken = crypto.createHash('sha256').update(resetPasswordToken).digest("hex"); //storing a hash
        
        await this.prismaService.mTrader.update({
            where: { email },
            data: {
                resetPasswordToken: resetPasswordHashedToken,
                resetPasswordExpires: new Date(Date.now() + 10 * 60 * 1000), //add ten min
            }
        })
        
        return resetPasswordToken;
    }
    
    public async resetPasswordFields(email: string) {
        await this.prismaService.mTrader.update({
            where: { email },
            data: {
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        }); 
    }

    public async resetAccountVerifyFields(email: string) {
        await this.prismaService.mTrader.update({
            where: { email },
            data: {
                verifyAccountToken: null,
                verifyAccountExpires: null
            }
        }); 
    }

    public async resetPassword(details: {token: string, newPassword: string}) {
        const hashedToken = crypto.createHash("sha256").update(details.token).digest("hex");
        const trader = await this.prismaService.mTrader.findFirst({
            where: { 
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!trader) 
            throw new BadRequestException("Token is invalid or has expired");

        const hashedPassword = await bcrypt.hash(details.newPassword, 10);

        await this.prismaService.mTrader.update({
            where: { id: trader.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });
    }

    public async generateAccountVerifyToken(email: string){ 
        try {            
            const verifyAccountToken = generateToken();
            const verifyAccountHashedToken = crypto.createHash('sha256').update(verifyAccountToken).digest("hex"); //storing a hash
    
            await this.prismaService.mTrader.update({
                where: { email },
                data: {
                    verifyAccountToken: verifyAccountHashedToken,
                    verifyAccountExpires: new Date(Date.now() + 10 * 60 * 1000), //add ten min
                }
            })
    
            return verifyAccountToken;
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002')
                    throw new BadRequestException('Email already exists');
            }
            throw new InternalServerErrorException(error.message || "Something went wrong.");
        }
    }

    public async verifyAccount(details: VerifyAccountDetails) {
        const trader = await this.prismaService.mTrader.findUnique({ where: { email: details.email } });
        if(!trader) 
            throw new BadRequestException('Email doesn\'t exist');
        
        const verifyAccountHashedToken = crypto.createHash('sha256').update(details.token).digest("hex"); //storing a hash
        
        await this.prismaService.mTrader.findUnique({
            where: { 
                email: details.email,
                verifyAccountToken: verifyAccountHashedToken,
                verifyAccountExpires: { gt: new Date() }
            }
        });

        if(!trader)
            throw new BadRequestException('Invalid token or token has expired');

        await this.resetAccountVerifyFields(trader.email);
    }

    private verifyEmailHtml(token: string) {
        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
          body {
              background-color: #f3e7d9;
              font-family: Arial, sans-serif;
              color: #1c1206;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border: 2px solid #be741e;
              padding: 20px;
              border-radius: 8px;
          }
          .header {
              background-color: #be741e;
              color: #ffffff;
              text-align: center;
              padding: 15px;
              border-radius: 6px 6px 0 0;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              margin-top: 20px;
              font-size: 16px;
              line-height: 1.5;
          }
          .button {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #be741e;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
          }
          .footer {
              margin-top: 30px;
              font-size: 12px;
              text-align: center;
              color: #1c1206;
          }
          </style>
          </head>
          <body>
          <div class="container">
              <div class="header">Tradewise</div>
              <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up! Please verify your email address to activate your account.</p>
              <p>Your verification token is: <strong>${token}</strong></p>
              <p>The token will expire in 10 minutes. If you did not create an account, please ignore this email.</p>
              <a href="https://yourdomain.com/verify-email?token=${token}" class="button">Verify Email</a>
              </div>
              <div class="footer">
              &copy; 2025 Tradewise. All rights reserved.
              </div>
          </div>
          </body>
          </html>
        `;
    }

    public async sendVerifyAccountToken(email: string ) {
        const token = await this.generateAccountVerifyToken(email);
        try {
            const verifyAccountEmailOptions = {
                to: email,
                subject: 'Verify Account Token',
                html: this.verifyEmailHtml(token),
            }
            await this.emailService.sendEmail(verifyAccountEmailOptions);
        } catch (error) {
            await this.resetAccountVerifyFields(email);
            throw new InternalServerErrorException(error.message);
        }
    }
}
