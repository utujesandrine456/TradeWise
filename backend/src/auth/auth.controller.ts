import { BadRequestException, Body, Controller, Get, Patch, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
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

@UseInterceptors(SanitizeInterceptor)
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}

    @UseGuards(ProtectedRouteGuard)
    @Get()
    public async get(@CurrentUser() user: IJwtPayload) {
        return this.authService.getProfile(user.sub);
    }

    @UseGuards(UnProtectedRouteGuard)
    @Post('register')
    public async register(@ValidatedBody(registerSchema) dto: any, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.register(dto);
        return {
            ...user,
            message: 'Registration successful. OTP sent to your email.',
            requiresVerification: true
        };
    }

    @UseGuards(UnProtectedRouteGuard)
    @Post('login')
    public async login(@ValidatedBody(loginSchema) dto: any, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.login(dto);
        const token = await this.authService.generateToken(user.id);

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return user;
    }

    
    @UseGuards(ProtectedRouteGuard)
    @Post('logout')
    public async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('accessToken');
        return { message: 'Logout successful' };
    }

    @UseGuards(ProtectedRouteGuard)
    @Patch()
    public async update(@ValidatedBody(updateSchema) dto: any, @CurrentUser() user: IJwtPayload) {
        return this.authService.update(dto, user.sub);
    }

    @UseGuards(ProtectedRouteGuard)
    @Post('onboarding')
    public async onboarding(@ValidatedBody(onboardingSchema) dto: any, @CurrentUser() user: IJwtPayload) {
        return this.authService.onboarding(dto, user.sub);
    }

    @UseGuards(UnProtectedRouteGuard)
    @Post('account/send')
    public async resendOtp(@Body('email') email: string) {
        return this.authService.resendOtp(email);
    }

    @UseGuards(UnProtectedRouteGuard)
    @Post('account/verify')
    public async verifyOtp(@Body() body: { email: string; otp: string }, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.verifyAccountWithOtp(body.otp, body.email);
        const token = await this.authService.generateToken(user.id);

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return {
            message: 'Account verified successfully',
            token,
            user
        };
    }
}
