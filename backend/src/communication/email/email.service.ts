<<<<<<< HEAD
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
=======
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter() {
    const emailConfig = {
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: parseInt(this.configService.get<string>('SMTP_PORT') || '587'),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true', 
      auth: {
        user: this.configService.get<string>('SMTP_USER') || '',
        pass: this.configService.get<string>('SMTP_PASS') || '',
      },
    };

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  private async sendEmail(emailContent: any) {
    try {
      if (!this.transporter) {
        console.log('Email would be sent (SMTP not configured):');
        console.log('To:', emailContent.to);
        console.log('Subject:', emailContent.subject);
        return { success: true, messageId: 'console-log' };
      }

      const info = await this.transporter.sendMail(emailContent);
      console.log(' Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(' Failed to send email:', error);
      throw error;
    }
  }


  async sendPasswordResetEmail(email: string, token: string, enterpriseName: string) {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/reset-password?token=${token}`;
    
    const emailContent = {
            to: email,
      subject: 'Reset Your TradeWise Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your TradeWise Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #f2730a;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(45deg, #f2730a, #e35a00);
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              text-align: center;
              margin: 20px 0;
            }
            .button:hover {
              background: linear-gradient(45deg, #e35a00, #bc4506);
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .highlight {
              background: #fef3c7;
              padding: 2px 6px;
              border-radius: 4px;
              font-weight: 600;
            }
            .warning {
              background: #fef2f2;
              border: 1px solid #fecaca;
              color: #dc2626;
              padding: 12px;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">TradeWise</div>
              <h1 class="title">Password Reset Request</h1>
            </div>
            
            <div class="content">
              <p>Hi <strong>${enterpriseName}</strong>,</p>
              
              <p>We received a request to reset your TradeWise account password.</p>
              
              <p>To reset your password, click the button below:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 6px; font-family: monospace;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <strong>Security Notice:</strong> This password reset link will expire in <span class="highlight">10 minutes</span> for security reasons.
              </div>
              
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              
              <p>For security reasons, we recommend:</p>
              <ul>
                <li>Using a strong, unique password</li>
                <li>Not sharing your password with anyone</li>
                <li>Logging out from shared devices</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>© 2025 TradeWise. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - TradeWise
        
        Hi ${enterpriseName},
        
        We received a request to reset your TradeWise account password.
        
        To reset your password, visit this link:
        ${resetUrl}
        
        Security Notice: This password reset link will expire in 10 minutes for security reasons.
        
        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        
        For security reasons, we recommend:
        - Using a strong, unique password
        - Not sharing your password with anyone
        - Logging out from shared devices
        
        © 2025 TradeWise. All rights reserved.
      `
    };

    console.log(' Sending password reset email to:', email);
    console.log('Reset URL:', resetUrl);
    
    return await this.sendEmail(emailContent);
  }

  async forgetPassword(otp: string, email: string) {
    const emailContent = {
            to: email,
      subject: 'Password Reset Code - TradeWise',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Code - TradeWise</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #f2730a;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .otp-code {
              background: linear-gradient(45deg, #f2730a, #e35a00);
              color: white;
              font-size: 32px;
              font-weight: bold;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
              letter-spacing: 8px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .warning {
              background: #fef2f2;
              border: 1px solid #fecaca;
              color: #dc2626;
              padding: 12px;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">TradeWise</div>
              <h1 class="title">Password Reset Code</h1>
            </div>
            
            <div class="content">
              <p>You requested a password reset for your TradeWise account.</p>
              
              <p>Use the following code to reset your password:</p>
              
              <div class="otp-code">${otp}</div>
              
              <div class="warning">
                <strong>Security Notice:</strong> This code will expire in <strong>10 minutes</strong> for security reasons.
              </div>
              
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <div class="footer">
              <p>© 2025 TradeWise. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Code - TradeWise
        
        You requested a password reset for your TradeWise account.
        
        Use the following code to reset your password:
        ${otp}
        
        Security Notice: This code will expire in 10 minutes for security reasons.
        
        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        
        © 2025 TradeWise. All rights reserved.
      `
    };

    console.log(' Sending password reset OTP email to:', email);
    console.log('OTP Code:', otp);
    
return await this.sendEmail(emailContent);
  }


  async verifyAccount(otp: string, email: string) {
    const emailContent = {
      to: email,
      subject: 'Account Verification Code - TradeWise',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification Code - TradeWise</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #f2730a;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .otp-code {
              background: linear-gradient(45deg, #10b981, #059669);
              color: white;
              font-size: 32px;
              font-weight: bold;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
              letter-spacing: 8px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .info {
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              color: #1e40af;
              padding: 12px;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">TradeWise</div>
              <h1 class="title">Account Verification Code</h1>
            </div>
            
            <div class="content">
              <p>Thank you for signing up with TradeWise!</p>
              
              <p>Use the following code to verify your account:</p>
              
              <div class="otp-code">${otp}</div>
              
              <div class="info">
                <strong>Note:</strong> This verification code will expire in <strong>10 minutes</strong> for security reasons.
              </div>
            </div>
            
            
            <div class="footer">
              <p>© 2025 TradeWise. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Account Verification Code - TradeWise
        
        Thank you for signing up with TradeWise!
        
        Use the following code to verify your account:
        ${otp}
        
        Note: This verification code will expire in 10 minutes for security reasons.
        
        
        © 2025 TradeWise. All rights reserved.
      `
    };

    console.log(' Sending account verification OTP email to:', email);
    console.log('OTP Code:', otp);
    
    return await this.sendEmail(emailContent);
  }
}
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
