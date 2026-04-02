import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { ContactUsDto } from './email.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('email')
export class EmailController {
    public constructor(private readonly emailService: EmailService){}

    @Post('contact-us')
    @Throttle({ default: { limit: 3, ttl: 60 } })
    public async contactUs(
        @Body() body: ContactUsDto,
    ) {
        return this.emailService.contactUs(body.name, body.email, body.message);
    }
}
