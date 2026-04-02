import { Injectable, Logger } from '@nestjs/common'; 
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { IEmailEnvs, IEmailOptions } from './email.types';

@Injectable()
export class EmailService {
    private emailEnvs: IEmailEnvs = {
        host: "",
        port: 0,
        user: "",
        password: ""
    };

    private emailLogger = new Logger("InstanceLoader");

    public constructor(
        private readonly configService: ConfigService
    ) {
        this.emailEnvs.host = this.configService.get<string>("EMAIL_HOST") ?? "";
        this.emailEnvs.port = this.configService.get<number>("EMAIL_PORT") ?? 0;
        this.emailEnvs.user = this.configService.get<string>("EMAIL_USER") ?? "";
        this.emailEnvs.password = this.configService.get<string>("EMAIL_PASSWORD") ?? "";

        // Only log in development for debugging
        if (this.configService.get<string>("NODE_ENV") !== 'production') {
            this.emailLogger.log('Email configuration are set')
        }
    }

    public async forgetPassword(otp: string, email: string) {
        const option: IEmailOptions = {
            to: email,
            subject: "Reset Your TradeWise Password",
            text: `Your OTP is ${otp}`,
            html: `
            <!DOCTYPE html>
            <html>
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Reset Your Password</title>
                </head>
                <body style="background-color:#fff4e6; font-family:Arial, sans-serif; color:#333; margin:0; padding:0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                    <td align="center">
                        <table width="480" cellpadding="20" cellspacing="0" style="background:#ffffff; border-radius:12px; margin:40px 10px; max-width:480px;">
                        <tr>
                            <td align="center">
                            <h2 style="color:#c46b09;">Reset Your Password</h2>
                            <p style="font-size:16px;">Use the OTP below to reset your TradeWise account password:</p>
                            <div style="font-size:24px; font-weight:bold; color:#d88310; background:#fff4e6; padding:12px 24px; border-radius:8px; display:inline-block; margin:10px 0;">
                                ${otp}
                            </div>
                            <p style="font-size:14px; color:#666;">If you didn’t request a password reset, please ignore this email.</p>
                            </td>
                        </tr>
                        </table>
                        <p style="font-size:12px; color:#999; margin-top:16px;">© 2025 TradeWise. Secure trading made simple.</p>
                    </td>
                    </tr>
                </table>
                </body>
            </html>
            `,
        };
        await this.sendEmail(option);
    }

    public async verifyAccount(otp: string, email: string) {
        const option: IEmailOptions = {
            to: email,
            subject: "Verify Your TradeWise Account",
            text: `Your OTP is ${otp}`,
            html: `
            <!DOCTYPE html>
            <html>
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Verify Your TradeWise Account</title>
                </head>
                <body style="background-color:#fff4e6; font-family:Arial, sans-serif; color:#333; margin:0; padding:0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                    <td align="center">
                        <table width="480" cellpadding="20" cellspacing="0" style="background:#ffffff; border-radius:12px; margin:40px 10px; max-width:480px;">
                        <tr>
                            <td align="center">
                            <h2 style="color:#c46b09;">Welcome to <span style="color:#d88310;">TradeWise</span></h2>
                            <p style="font-size:16px;">Please use the following OTP to verify your account:</p>
                            <div style="font-size:24px; font-weight:bold; color:#d88310; background:#fff4e6; padding:12px 24px; border-radius:8px; display:inline-block; margin:10px 0;">
                                ${otp}
                            </div>
                            <p style="font-size:14px; color:#666;">This code will expire in 10 minutes for security reasons.</p>
                            </td>
                        </tr>
                        </table>
                        <p style="font-size:12px; color:#999; margin-top:16px;">© 2025 TradeWise. All rights reserved.</p>
                    </td>
                    </tr>
                </table>
                </body>
            </html>
            `,
        };
        await this.sendEmail(option);
    }

    private async sendEmail(option: IEmailOptions){
        // Validate email configuration
        if (!this.emailEnvs.host || !this.emailEnvs.port || !this.emailEnvs.user || !this.emailEnvs.password) {
            console.error('Email configuration missing:', {
                host: this.emailEnvs.host,
                port: this.emailEnvs.port,
                user: this.emailEnvs.user ? 'configured' : 'missing',
                password: this.emailEnvs.password ? 'configured' : 'missing'
            });
            throw new Error('Unable to send message at this time. Please try again later.');
        }

        const transporter = nodemailer.createTransport({
            host: this.emailEnvs.host,
            port: this.emailEnvs.port,
            auth: {
                user: this.emailEnvs.user,
                pass: this.emailEnvs.password
            },
            secure: false,
        });

        try {
            const emailOptions: IEmailOptions & {from: string} = {
                from: "Tradewise <communications@tradewise.com>",
                to: option.to,
                subject: option.subject,
                text: option.text,
                html: option.html
            }

            await transporter.sendMail(emailOptions);
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error('Message could not be sent. Please try again later.');
        }
    }

    public async contactUs(name: string, email: string, message: string) {
        const option: IEmailOptions = {
            to: "communications@tradewise.com",
            subject: "Contact Us Message",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `
            <!DOCTYPE html>
            <html>
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>New Contact Message</title>
                <style>
                    @media only screen and (max-width: 600px) {
                        .container {
                            width: 90% !important;
                            padding: 10px !important;
                        }
                        h2 {
                            font-size: 20px !important;
                        }
                        p {
                            font-size: 14px !important;
                        }
                    }
                </style>
                </head>
                <body style="background-color:#fff4e6; font-family:Arial, sans-serif; color:#333; margin:0; padding:0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                    <td align="center">
                        <table class="container" width="480" cellpadding="20" cellspacing="0" style="background:#ffffff; border-radius:12px; margin:40px 10px; max-width:480px;">
                        <tr>
                            <td>
                            <h2 style="color:#c46b09;">New Contact Message</h2>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Message:</strong></p>
                            <p style="background:#fff4e6; padding:10px; border-radius:8px;">${message}</p>
                            </td>
                        </tr>
                        </table>
                        <p style="font-size:12px; color:#999; margin-top:16px;">© 2025 TradeWise Communications</p>
                    </td>
                    </tr>
                </table>
                </body>
            </html>
            `,
        };
        await this.sendEmail(option);

        return { message: "Email sent successfully" };
    }
}
