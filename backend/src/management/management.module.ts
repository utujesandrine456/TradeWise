import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { StockModule } from './stock/stock.module';

@Module({
    imports: [
        CategoryModule,
        StockModule,
    ]
})
export class ManagementModule {}