<<<<<<< HEAD
import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FinancialsModule } from '../financials/financials.module';
import { AppCacheModule } from '../../cache/cache.module';

@Module({
  imports: [
    PrismaModule,
    FinancialsModule,
    AppCacheModule
  ],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
=======
import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FinancialsModule } from '../financials/financials.module';

@Module({
  imports: [
    PrismaModule,
    FinancialsModule
  ],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
