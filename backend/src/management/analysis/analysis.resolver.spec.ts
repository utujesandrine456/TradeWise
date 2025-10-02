import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisResolver } from './analysis.resolver';
import { AnalysisService } from './analysis.service';

describe('AnalysisResolver', () => {
  let resolver: AnalysisResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisResolver, AnalysisService],
    }).compile();

    resolver = module.get<AnalysisResolver>(AnalysisResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
