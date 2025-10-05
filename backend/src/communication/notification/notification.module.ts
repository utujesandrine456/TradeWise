import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationResolver } from './notification.resolver';
import { Notification2Service } from './notification2.service';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [
    NotificationService, 
    NotificationResolver, 
    Notification2Service
  ],
  exports: [
    NotificationService, 
    NotificationResolver, 
    Notification2Service
  ]
})
export class NotificationModule {}
