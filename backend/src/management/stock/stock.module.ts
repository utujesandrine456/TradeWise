import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockImageResolver } from './stock.image.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StockResolver } from './stock.resolver';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [
    StockService, 
    StockImageResolver, 
    StockResolver,
  ],
})
export class StockModule {}
