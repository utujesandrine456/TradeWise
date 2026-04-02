import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { StockModule } from './stock/stock.module';
import { FinancialsModule } from './financials/financials.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [
    TransactionModule, 
    StockModule, 
    FinancialsModule, AnalysisModule
  ]
})
export class ManagementModule {}
