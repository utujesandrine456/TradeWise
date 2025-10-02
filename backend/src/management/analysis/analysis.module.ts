import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisResolver } from './analysis.resolver';

@Module({
  providers: [AnalysisResolver, AnalysisService],
})
export class AnalysisModule {}
