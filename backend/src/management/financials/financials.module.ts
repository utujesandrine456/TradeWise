import { Module } from '@nestjs/common';
import { FinancialsService } from './financials.service';
import { FinancialsResolver } from './financials.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
<<<<<<< HEAD
import { AppCacheModule } from '../../cache/cache.module';

@Module({
  imports: [
    PrismaModule,
    AppCacheModule
=======

@Module({
  imports: [
    PrismaModule
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
  ],
  providers: [FinancialsResolver, FinancialsService],
  exports: [FinancialsService]
})
export class FinancialsModule {}
