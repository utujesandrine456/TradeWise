import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { EmailService } from 'src/communication/email/email.service';

@Processor('emails')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  @Process('send-welcome')
  async handleWelcomeEmail(job: Job<{ traderId: string; email: string; name: string }>) {
    this.logger.log(`Processing welcome email for trader ${job.data.traderId}`);
    
    try {
      // TODO: Implement email sending logic
      this.logger.log(`Welcome email would be sent to ${job.data.email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email: ${error.message}`);
      throw error;
    }
  }

  @Process('send-transaction-receipt')
  async handleTransactionReceipt(job: Job<{ traderId: string; email: string; transactionId: string }>) {
    this.logger.log(`Processing transaction receipt for trader ${job.data.traderId}`);
    
    try {
      // TODO: Implement email sending logic
      this.logger.log(`Transaction receipt would be sent to ${job.data.email}`);
    } catch (error) {
      this.logger.error(`Failed to send transaction receipt: ${error.message}`);
      throw error;
    }
  }
}
