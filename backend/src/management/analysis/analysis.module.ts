import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisResolver } from './analysis.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
<<<<<<< HEAD
import { AppCacheModule } from 'src/cache/cache.module';
import { CacheTrackerService } from 'src/custom/services/cache-tracker.service';

@Module({
  imports: [PrismaModule, AppCacheModule],
  providers: [AnalysisService, AnalysisResolver, CacheTrackerService],
  exports: [AnalysisService],
=======

@Module({
  imports: [PrismaModule],
  providers: [AnalysisResolver, AnalysisService],
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
})
export class AnalysisModule {}
