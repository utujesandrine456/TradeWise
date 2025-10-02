import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
