import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockResolver } from './stock.resolver';

@Module({
    providers: [StockResolver, StockService],
})
export class StockModule {}
