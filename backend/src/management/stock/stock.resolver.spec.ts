import { Test, TestingModule } from '@nestjs/testing';
import { StockResolver } from './stock.resolver';
import { StockService } from './stock.service';

describe('StockResolver', () => {
  let resolver: StockResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockResolver, StockService],
    }).compile();

    resolver = module.get<StockResolver>(StockResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
