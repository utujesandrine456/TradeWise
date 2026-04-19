import { Body, Controller, Get, InternalServerErrorException, Patch, Post, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { IJwtPayload } from './auth.types';
import { ConfigService } from '@nestjs/config';
import { ValidatedBody } from 'src/custom/decorators/validate.decorator';
import { loginSchema, onboardingSchema, registerSchema, updateSchema } from './auth.dto-schema';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { ProtectedRouteGuard } from 'src/custom/guards/protected-route/protected-route.guard';
import { UnProtectedRouteGuard } from 'src/custom/guards/un-protected-route/un-protected-route.guard';
import { SanitizeInterceptor } from 'src/custom/interceptors/sanitize/sanitize.interceptor';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) { }

    private time = 7 * 24 * 60 * 60 * 1000;

    @UseGuards(ProtectedRouteGuard)
    @UseInterceptors(SanitizeInterceptor)
    @Get()
    public async get(
        @CurrentUser() user: IJwtPayload
    ) {
        return this.authService.getProfile(user.sub);
    }

    // @UseGuards(UnProtectedRouteGuard)
    @UseInterceptors(SanitizeInterceptor)
    @Post('register')
    public async register(
        @ValidatedBody(registerSchema) dto: any,
        @Res({ passthrough: true }) res: Response
    ) {
        const newUser = await this.authService.register(dto);

        const token = await this.authService.generateToken(newUser.id);

        const isProd = this.configService.get('NODE_ENV') === 'production';
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: isProd,         // true in production, false in development
            sameSite: isProd ? 'none' : 'lax',  // 'none' for cross-domain in production, 'lax' for local development
            path: '/',
            maxAge: this.time // for 7 days
        });

        // try {
        //     // Priority: Phone verification
        //     if (newUser.phone) {
        //         await this.authService.sendOtp({ phone: newUser.phone, isPasswordReset: false });
        //     }
        // } catch (error) {
        //     console.error('Failed to send verification code:', error);
        //     // We don't throw here to allow the user to at least be registered and try resending later
        // }

        return newUser;
    }

    // @UseGuards(UnProtectedRouteGuard)
    @UseInterceptors(SanitizeInterceptor)
    @Post('login')
    public async login(
        @ValidatedBody(loginSchema) dto: any,
        @Res({ passthrough: true }) res: Response
    ) {
        const loginUser = await this.authService.login(dto);

        const token = await this.authService.generateToken(loginUser.id);
        const isProd = this.configService.get('NODE_ENV') === 'production';
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: isProd,         // true in production, false in development
            sameSite: isProd ? 'none' : 'lax',  // 'none' for cross-domain in production, 'lax' for local development
            path: '/',
            maxAge: this.time // for 7 days
        });

        return loginUser;
    }

    @Post('logout')
    @UseGuards(ProtectedRouteGuard)
    public async logout(@Res() res: Response) {
        const isProd = this.configService.get('NODE_ENV') === 'production';
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: isProd,         // true in production, false in development
            sameSite: isProd ? 'none' : 'lax',  // 'none' for cross-domain in production, 'lax' for local development
            path: '/',
        });
        return res.json({ message: 'Logout successful' });
    }


    @UseGuards(ProtectedRouteGuard)
    @UseInterceptors(SanitizeInterceptor)
    @Patch()
    public async update(
        @ValidatedBody(updateSchema) dto: any,
        @CurrentUser() user: IJwtPayload
    ) {
        return this.authService.update(dto, user.sub);
    }

    @UseGuards(ProtectedRouteGuard)
    @Post('onboarding')
    public async onboarding(
        @ValidatedBody(onboardingSchema) dto: any,
        @CurrentUser() user: IJwtPayload,
    ) {
        return this.authService.onboarding(dto, user.sub);
    }

    @Get('settings')
    @UseGuards(ProtectedRouteGuard)
    public async getSettings(
        @CurrentUser() user: IJwtPayload,
    ) {
        return this.authService.getSettings(user.sub);
    }
}
