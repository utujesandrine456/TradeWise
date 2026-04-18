import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);
    private readonly termiiApiKey: string;
    private readonly termiiSenderId: string;
    private readonly termiiBaseUrl = 'https://api.ng.termii.com/api/sms/send';

    constructor(private readonly configService: ConfigService) {
        this.termiiApiKey = this.configService.get<string>('TERMII_API_KEY') ?? '';
        this.termiiSenderId = this.configService.get<string>('TERMII_SENDER_ID') ?? 'TradeWise';

        if (this.termiiApiKey) {
            this.logger.log('Termii SMS service initialized');
        } else {
            this.logger.warn('Termii API key missing. SMS service will not send real messages.');
        }
    }

    private formatPhoneNumber(phone: string): string {
        const cleanPhone = phone.replace(/\D/g, '');

        if (cleanPhone.startsWith('07') && cleanPhone.length === 10) {
            return `250${cleanPhone.substring(1)}`;
        }

        if (phone.startsWith('+')) {
            return cleanPhone;
        }

        return cleanPhone;
    }

    private async sendSms(phone: string, message: string): Promise<void> {
        const formattedPhone = this.formatPhoneNumber(phone);

        if (!this.termiiApiKey) {
            this.logger.warn(`MOCK SMS to ${formattedPhone}: ${message}`);
            return;
        }

        try {
            const payload = {
                to: formattedPhone,
                from: 'Stocka',
                sms: message,
                type: 'plain',
                channel: 'generic',
                api_key: this.termiiApiKey,
            };

            const response = await axios.post(this.termiiBaseUrl, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            this.logger.log(`SMS sent to ${formattedPhone} via Termii — messageId: ${response.data?.message_id}`);
        } catch (error) {
            const errorDetail = error.response
                ? `Status ${error.response.status}: ${JSON.stringify(error.response.data)}`
                : error.message;
            this.logger.error(`Failed to send SMS to ${formattedPhone}: ${errorDetail}`);
            throw new Error('Failed to send SMS');
        }
    }

    async sendOtp(phone: string, otp: string): Promise<void> {
        const message = `Your TradeWise verification code is: ${otp}. Valid for 10 minutes.`;
        await this.sendSms(phone, message);
    }

    async sendPasswordResetOtp(phone: string, otp: string): Promise<void> {
        const message = `Your TradeWise password reset code is: ${otp}. Valid for 10 minutes.`;
        await this.sendSms(phone, message);
    }
}
