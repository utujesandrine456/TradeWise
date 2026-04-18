import { Module } from '@nestjs/common';
import { FinancialsService } from './financials.service';
import { FinancialsResolver } from './financials.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppCacheModule } from '../../cache/cache.module';

@Module({
  imports: [
    PrismaModule,
    AppCacheModule
  ],
  providers: [FinancialsResolver, FinancialsService],
  exports: [FinancialsService]
})
export class FinancialsModule {}
