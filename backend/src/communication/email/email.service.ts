import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from 'src/config/config.service';
import { IEmailEnvs, IEmailOptions } from './email.types';

@Injectable()
export class EmailService {
    private emailEnvs: IEmailEnvs;

    public constructor(
        private readonly configService: ConfigService
    ) {
        this.emailEnvs = this.configService.getEmailEnv;
    }


    public async sendEmail(option: IEmailOptions){
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