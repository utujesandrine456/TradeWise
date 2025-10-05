import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    EmailModule, 
    NotificationModule
  ]
})
export class CommunicationModule {}
