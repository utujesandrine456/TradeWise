import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';

@Module({})
export class CommunicationModule {
    imports: [EmailModule]
}
