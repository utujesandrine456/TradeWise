import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisResolver } from './analysis.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppCacheModule } from 'src/cache/cache.module';
import { CacheTrackerService } from 'src/custom/services/cache-tracker.service';

@Module({
  imports: [PrismaModule, AppCacheModule],
  providers: [AnalysisService, AnalysisResolver, CacheTrackerService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
