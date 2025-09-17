import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as idTools from 'id-tools';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TJwtPayload, TLoginTrader, TRegisterTrader, TUpdateTrader } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { generateToken } from 'src/custom/utils/generateToken';

@Injectable()
export class AuthService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
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
}
