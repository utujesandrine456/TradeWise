import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth2Controller } from './auth2.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/communication/email/email.module';
import { CurrencyModule } from 'src/custom/utils/currency.md';

@Module({
    imports: [
        ConfigModule,
        EmailModule,
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
export class AuthModule {}
