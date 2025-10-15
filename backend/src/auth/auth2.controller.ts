import { Controller, InternalServerErrorException, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidatedBody } from 'src/custom/decorators/validate.decorator';
import { forgetPasswordSchema, resetPasswordSchema, sendOtpSchema, verifyOtpSchema } from './auth.dto-schema';
import { EmailService } from 'src/communication/email/email.service';
import { UnProtectedRouteGuard } from 'src/custom/guards/un-protected-route/un-protected-route.guard';
import { SanitizeInterceptor } from 'src/custom/interceptors/sanitize/sanitize.interceptor';



@UseInterceptors(SanitizeInterceptor)
@UseGuards(UnProtectedRouteGuard)
@Controller('auth')
export class Auth2Controller {
    public constructor(
        private readonly authService: AuthService,
        private readonly emailService: EmailService
    ) {}

    
    @Post('password/forget')
    public async forgetPassword (
        @ValidatedBody(forgetPasswordSchema) dto: any
    ) {
        const otp = await this.authService.sendOtp({ email: dto.email, phone: dto.phone, isPasswordReset: true });
        

        try {
            await this.emailService.forgetPassword(otp, dto.email);
            return otp;
        } catch (error) {
            throw new InternalServerErrorException('Failed to send email', error.message);
        }
    }


    @Post('password/reset')
    public async resetPassword (
        @ValidatedBody(resetPasswordSchema) dto: any
    ) {
        const user = await this.authService.verifyOtp({ email: dto.email, phone: dto.phone, otp: dto.otp, isPasswordReset: true });
        return await this.authService.resetPassword({password: dto.password }, user.id);
    }


    @Post('account/send')
    public async sendOtp (
        @ValidatedBody(sendOtpSchema) dto: any
    ) {
        const otp = await this.authService.sendOtp({ email: dto.email, phone: dto.phone, isPasswordReset: false });

        try {
            await this.emailService.verifyAccount(otp, dto.email);
            return otp;
        } catch (error) {
            throw new InternalServerErrorException('Failed to send email', error.message);
        }
    }


    @Post('account/verify')
    public async verifyOtp (
        @ValidatedBody(verifyOtpSchema) dto: any
    ) {
        await this.authService.verifyOtp({ email: dto.email, phone: dto.phone, otp: dto.otp, isPasswordReset: false });
        return { message: 'Account verified successfully' };
    }
}
