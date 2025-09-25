import { Body, Controller, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from 'src/config/config.service';
import { ForgotPasswordDto, ResetPasswordDto, VerifyAccountDto } from './auth.dto';
import { EmailService } from 'src/communication/email/email.service';
import { UnProtectedRoutesGuard } from 'src/custom/guards/un-protected-routes/un-protected-routes.guard';
import { EmailValidationPipe } from 'src/custom/pipes/EmailValidation.pipe';

@Controller('auth')
export class Auth2Controller {
    constructor(
        private readonly authService: AuthService,
        private readonly emailService: EmailService,
    ) {}

    private emailHtml(token: string) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
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
                <p>We received a request to reset your password.</p>
                <p>Your Password reset token is: <strong>${token}</strong></p>
                <p>The token will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
                </div>
                <div class="footer">
                &copy; 2025 Tradewise. All rights reserved.
                </div>
            </div>
            </body>
            </html>
        `
    }  

    @Post('password/forgot')
    @UseGuards(UnProtectedRoutesGuard)
    public async forgotPassword(
        @Body() dto: ForgotPasswordDto
    ) {
        const { email, phone } = dto;
        this.authService.forgetPassword({ email, phone });
    }
    
    @Post('password/reset')
    @UseGuards(UnProtectedRoutesGuard)
    public async resetPassword(
        @Body() dto: ResetPasswordDto
    ) {
        const { token, password } = dto;
        this.authService.resetPassword({ token, password });
    }

    @Post('account/send-token')
    @UseGuards(UnProtectedRoutesGuard)
    public async sendVerifyAccountToken(
        @Body() dto: VerifyAccountDto
    ) {
        const { email, phone } = dto;
        this.authService.sendVerifyAccountToken({ email, phone });
    }

    @Post('account/resend-token')
    @UseGuards(UnProtectedRoutesGuard)
    public async resendVerifyAccountToken(
        @Body() dto: VerifyAccountDto
    ) {
        const { email, phone } = dto;
        this.authService.sendVerifyAccountToken({ email, phone });
    }

    @Post('account/verify')
    @UseGuards(UnProtectedRoutesGuard)
    public async verifyAccount(
        @Body() dto: VerifyAccountDto
    ) {
        const { token } = dto;
        this.authService.verifyAccount(token);
    }
}
