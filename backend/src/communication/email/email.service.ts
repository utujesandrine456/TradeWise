import { Injectable } from '@nestjs/common';
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

    public constructor(
        private readonly configService: ConfigService
    ) {
        this.emailEnvs.host = this.configService.get<string>("EMAIL_HOST") ?? "";
        this.emailEnvs.port = this.configService.get<number>("EMAIL_PORT") ?? 0;
        this.emailEnvs.user = this.configService.get<string>("EMAIL_USER") ?? "";
        this.emailEnvs.password = this.configService.get<string>("EMAIL_PASSWORD") ?? "";
    }

    public async forgetPassword(otp: string, email: string) {
        const option: IEmailOptions = {
            to: email,
            subject: "Reset Password",
            text: `Your OTP is ${otp}`,
            html: `<p>Your OTP is ${otp}</p>`
        };
        await this.sendEmail(option);
    }

    public async verifyAccount(otp: string, email: string) {
        const option: IEmailOptions = {
            to: email,
            subject: "Verify Account",
            text: `Your OTP is ${otp}`,
            html: `<p>Your OTP is ${otp}</p>`
        };
        await this.sendEmail(option);
    }


    // for internal use only
    private async sendEmail(option: IEmailOptions){
        const transporter = nodemailer.createTransport({
            host: this.emailEnvs.host,
            port: this.emailEnvs.port,
            auth: {
                user: this.emailEnvs.user,
                pass: this.emailEnvs.password
            },
            secure: false,
        });

        const emailOptions: IEmailOptions & {from: string} = {
            from: "Tradewise <communications@tradewise.com>",
            to: option.to,
            subject: option.subject,
            text: option.text,
            html: option.html
        }

        await transporter.sendMail(emailOptions);
    }
}