import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationResolver } from './notification.resolver';
import { Notification2Service } from './notification2.service';
<<<<<<< HEAD
import { NotificationGateway } from './notification.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
=======

@Module({
  imports: [
    PrismaModule
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
  ],
  providers: [
    NotificationService, 
    NotificationResolver, 
<<<<<<< HEAD
    Notification2Service,
    NotificationGateway,
  ],
  exports: [
    NotificationService,
    NotificationGateway,
=======
    Notification2Service
  ],
  exports: [
    NotificationService, 
    NotificationResolver, 
    Notification2Service
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
  ]
})
export class NotificationModule {}
