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

    private async sendEmail(option: IEmailOptions) {
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
            const emailOptions: IEmailOptions & { from: string } = {
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
