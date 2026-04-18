import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth2Controller } from './auth2.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/communication/email/email.module';
import { SmsModule } from 'src/communication/sms/sms.module';
import { CurrencyModule } from 'src/custom/utils/currency.service';

@Module({
    imports: [
        ConfigModule,
        EmailModule,
        SmsModule,
        CurrencyModule
    ],
    controllers: [
        AuthController,
        Auth2Controller
    ],
    providers: [
        AuthService,
        PrismaService,
    ],
})
export class AuthModule { }
