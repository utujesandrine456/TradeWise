import { Test, TestingModule } from '@nestjs/testing';
import { FinancialsResolver } from './financials.resolver';
import { FinancialsService } from './financials.service';

describe('FinancialsResolver', () => {
  let resolver: FinancialsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialsResolver, FinancialsService],
    }).compile();

    resolver = module.get<FinancialsResolver>(FinancialsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
