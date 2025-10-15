import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockImageResolver } from './stock.image.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StockResolver } from './stock.resolver';
import { StockController } from './stock.controller';

@Module({
  imports: [PrismaModule],
  controllers: [StockController],
  providers: [StockService, StockImageResolver, StockResolver],
  exports: [StockService], 
})
export class StockModule {}
