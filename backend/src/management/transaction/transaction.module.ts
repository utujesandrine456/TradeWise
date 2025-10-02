import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FinancialsModule } from '../financials/financials.module';

@Module({
  imports: [
    PrismaModule,
    FinancialsModule
  ],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
