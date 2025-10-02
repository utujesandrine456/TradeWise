import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    TransactionModule, 
    StockModule
  ]
})
export class ManagementModule {}
