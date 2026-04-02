import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './processors/notification.processor';
import { EmailProcessor } from './processors/email.processor';
import { ReportProcessor } from './processors/report.processor';
import { QueueService } from './queue.service';
import { NotificationModule } from 'src/communication/notification/notification.module';
import { EmailModule } from 'src/communication/email/email.module';
import { AnalysisModule } from 'src/management/analysis/analysis.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      { name: 'notifications' },
      { name: 'emails' },
      { name: 'reports' }
    ),
    NotificationModule,
    EmailModule,
    AnalysisModule,
  ],
  providers: [NotificationProcessor, EmailProcessor, ReportProcessor, QueueService],
  exports: [BullModule, QueueService],
})
export class QueueModule {}
