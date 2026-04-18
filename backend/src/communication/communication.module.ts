import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { NotificationModule } from './notification/notification.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    EmailModule,
    NotificationModule,
    SmsModule
  ],
  exports: [SmsModule]
})
export class CommunicationModule { }
