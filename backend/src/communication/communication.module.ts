import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    EmailModule, 
    NotificationsModule
  ]
})
export class CommunicationModule {}
