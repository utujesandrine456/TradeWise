import { Test, TestingModule } from '@nestjs/testing';
<<<<<<< HEAD
import { StockResolver } from './stock.image.resolver';
import { StockService } from './stock.service';

=======
import { StockResolver } from './stock.resolver';
import { StockService } from './stock.service';



>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
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
<<<<<<< HEAD
=======

>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
});
