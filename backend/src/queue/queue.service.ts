import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
    @InjectQueue('emails') private emailsQueue: Queue,
    @InjectQueue('reports') private reportsQueue: Queue,
  ) {}

  async addLowStockNotification(traderId: string, stockImageId: string) {
    await this.notificationsQueue.add('send-low-stock', { traderId, stockImageId }, {
      delay: 0,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }

  async addPaymentReminder(traderId: string, type: string) {
    await this.notificationsQueue.add('send-payment-reminder', { traderId, type }, {
      delay: 0,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }

  async addWelcomeEmail(traderId: string, email: string, name: string) {
    await this.emailsQueue.add('send-welcome', { traderId, email, name }, {
      delay: 0,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }

  async addTransactionReceipt(traderId: string, email: string, transactionId: string) {
    await this.emailsQueue.add('send-transaction-receipt', { traderId, email, transactionId }, {
      delay: 0,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }

  async addFinancialReport(traderId: string, startDate: Date, endDate: Date) {
    await this.reportsQueue.add('generate-financial-report', { traderId, startDate, endDate }, {
      delay: 0,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }

  async addInventoryReport(traderId: string, stockId: string) {
    await this.reportsQueue.add('generate-inventory-report', { traderId, stockId }, {
      delay: 0,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }
}
