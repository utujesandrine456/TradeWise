import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { StockModule } from './stock/stock.module';
import { ProductModule } from './product/product.module';

@Module({
    imports: [
        CategoryModule,
        StockModule,
        ProductModule,
    ]
})
export class ManagementModule {}