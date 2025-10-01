import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockImageResolver } from './stockImage.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [
    StockImageResolver, 
    StockService
  ],
})
export class StockModule {}
