// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'src/config/config.module';
import { PrismaModule } from 'src/prisma/prisma.module'; // import the module
import { EmailModule } from 'src/communication/email/email.module';
import { Auth2Controller } from './auth2.controller';

@Module({
  imports: [
    PrismaModule, // ✅ add this
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: '7d' },
    }),
    EmailModule
  ],
  controllers: [AuthController, Auth2Controller],
  providers: [AuthService],
})
export class AuthModule {}
