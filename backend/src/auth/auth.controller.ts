<<<<<<< HEAD
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
import { EmailService } from 'src/communication/email/email.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService
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

        try {
            // create the verify email token and send email
            const otp = await this.authService.sendOtp({ email: newUser.email as string, isPasswordReset: false });
            await this.emailService.verifyAccount(otp, newUser.email as string);
        } catch (error) {
            throw new InternalServerErrorException('Failed to send email', error.message);
        }

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
=======
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
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
