import { Module } from '@nestjs/common';
import { FinancialsService } from './financials.service';
import { FinancialsResolver } from './financials.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [FinancialsResolver, FinancialsService],
  exports: [FinancialsService]
})
export class FinancialsModule {}
