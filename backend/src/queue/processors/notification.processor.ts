import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { NotificationService } from 'src/communication/notification/notification.service';

@Processor('notifications')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationService: NotificationService) {}

  @Process('send-low-stock')
  async handleLowStockNotification(job: Job<{ traderId: string; stockImageId: string }>) {
    this.logger.log(`Processing low stock notification for trader ${job.data.traderId}`);
    
    try {
      await this.notificationService.lowStockAlert(job.data.traderId, job.data.stockImageId);
      this.logger.log(`Low stock notification sent for stock image ${job.data.stockImageId}`);
    } catch (error) {
      this.logger.error(`Failed to send low stock notification: ${error.message}`);
      throw error;
    }
  }

  @Process('send-payment-reminder')
  async handlePaymentReminder(job: Job<{ traderId: string; type: string }>) {
    this.logger.log(`Processing payment reminder for trader ${job.data.traderId}`);
    
    try {
      await this.notificationService.financialRemainder(job.data.traderId, job.data.type as any);
      this.logger.log(`Payment reminder sent for trader ${job.data.traderId}`);
    } catch (error) {
      this.logger.error(`Failed to send payment reminder: ${error.message}`);
      throw error;
    }
  }
}
