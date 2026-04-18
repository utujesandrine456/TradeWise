import { Controller, InternalServerErrorException, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidatedBody } from 'src/custom/decorators/validate.decorator';
import { forgetPasswordSchema, resetPasswordSchema, sendOtpSchema, verifyOtpSchema } from './auth.dto-schema';
import { UnProtectedRouteGuard } from 'src/custom/guards/un-protected-route/un-protected-route.guard';
import { SanitizeInterceptor } from 'src/custom/interceptors/sanitize/sanitize.interceptor';
import { ProtectedRouteGuard } from 'src/custom/guards/protected-route/protected-route.guard';

@UseInterceptors(SanitizeInterceptor)
@Controller('auth')
export class Auth2Controller {
    public constructor(
        private readonly authService: AuthService
    ) { }

    @Post('password/forget')
    @UseGuards(UnProtectedRouteGuard)
    public async forgetPassword(
        @ValidatedBody(forgetPasswordSchema) dto: any
    ) {
        await this.authService.sendOtp({ email: dto.email, phone: dto.phone, isPasswordReset: true });
        return { message: 'Verification code sent' };
    }

    @Post('password/reset')
    @UseGuards(UnProtectedRouteGuard)
    public async resetPassword(
        @ValidatedBody(resetPasswordSchema) dto: any
    ) {
        const user = await this.authService.verifyOtp({ email: dto.email, phone: dto.phone, otp: dto.otp, isPasswordReset: true });
        return await this.authService.resetPassword({ password: dto.password }, user.id);
    }

    @Post('account/send')
    @UseGuards(ProtectedRouteGuard)
    public async sendOtp(
        @ValidatedBody(sendOtpSchema) dto: any
    ) {
        await this.authService.sendOtp({ email: dto.email, phone: dto.phone, isPasswordReset: false });
        return { message: 'Verification code sent' };
    }

    @Post('account/verify')
    @UseGuards(ProtectedRouteGuard)
    public async verifyOtp(
        @ValidatedBody(verifyOtpSchema) dto: any
    ) {
        await this.authService.verifyOtp({ email: dto.email, phone: dto.phone, otp: dto.otp, isPasswordReset: false });
        return { message: 'Account verified successfully' };
    }
}
