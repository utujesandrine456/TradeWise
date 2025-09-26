import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth2Controller } from './auth2.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/communication/email/email.module';

@Module({
    imports: [
        ConfigModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '7d' },
        }),
        EmailModule,
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
