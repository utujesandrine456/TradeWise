import { BadRequestException, Body, Controller, Get, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { IJwtPayload, TRegisterDetails } from './auth.types';
import { ConfigService } from '@nestjs/config';
import { ValidatedBody } from 'src/custom/decorators/validate.decorator';
import { loginSchema, onboardingSchema, registerSchema, updateSchema } from './auth.dto-schema';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { ProtectedRouteGuard } from 'src/custom/guards/protected-route/protected-route.guard';
import { UnProtectedRouteGuard } from 'src/custom/guards/un-protected-route/un-protected-route.guard';
import { SanitizeInterceptor } from 'src/custom/interceptors/sanitize/sanitize.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { storage } from 'src/custom/utils/cloudinary.config';
import * as multer from 'multer';

@UseInterceptors(SanitizeInterceptor)
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}

    @UseGuards(ProtectedRouteGuard)
    @Get()
    public async get(
        @CurrentUser() user: IJwtPayload
    ) {
        return this.authService.getProfile(user.sub);
    }

    @UseGuards(UnProtectedRouteGuard)
    @Post('register')
    public async register(
        @ValidatedBody(registerSchema) dto: any,
        @Res({ passthrough: true }) res: Response
    ) {
        const user = await this.authService.register(dto);
        
        const token = await this.authService.generateToken(user.id);
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return user;
    }
    
    @UseGuards(UnProtectedRouteGuard)
    @Post('login')
    public async login(
        @ValidatedBody(loginSchema) dto: any,
        @Res({ passthrough: true }) res: Response
    ) {
        const user = await this.authService.login(dto);
        
        const token = await this.authService.generateToken(user.id);
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return user;
    }
    
    @UseGuards(ProtectedRouteGuard)
    @Post('logout')
    public async logout(
        @Res({ passthrough: true }) res: Response,
    ) {
        res.clearCookie('accessToken');
        return { message: 'Logout' };
    }
    
    @UseGuards(ProtectedRouteGuard)
    @Patch()
    public async update(
        @ValidatedBody(updateSchema) dto: any,
        @CurrentUser() user: IJwtPayload
    ) {
        return this.authService.update(dto, user.sub);
    }
    
    @UseGuards(ProtectedRouteGuard)
    @UseInterceptors(FileInterceptor('logo', { storage }))
    @Post('onboarding')
    public async onboarding(
        @ValidatedBody(onboardingSchema) dto: any,
        @CurrentUser() user: IJwtPayload,
        @UploadedFile() logo?: Express.Multer.File
    ) {
        try {    
            const onboarding = await this.authService.getOnboarding(user.sub);
            if (logo && onboarding.logo_PublicId)
                await cloudinary.uploader.destroy(onboarding.logo_PublicId);
    
            return await this.authService.onboarding({
                ...dto, 
                logoUrl: logo?.path,
                logo_PublicId: logo?.filename
            }, user.sub);
        } catch (error) {
            if(logo?.filename && error instanceof multer.MulterError){
                await cloudinary.uploader.destroy(logo?.filename);
                throw new BadRequestException(error.message);
            }

            throw error;
        }
    }
}
