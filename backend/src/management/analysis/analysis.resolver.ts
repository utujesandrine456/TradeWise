import { Resolver } from '@nestjs/graphql';
import { AnalysisService } from './analysis.service';

@Resolver()
export class AnalysisResolver {
  constructor(private readonly analysisService: AnalysisService) {}
}
