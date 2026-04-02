<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { Resolver } from './.resolver';

describe('Resolver', () => {
  let resolver: Resolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Resolver],
    }).compile();

    resolver = module.get<Resolver>(Resolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
=======
import { Test, TestingModule } from '@nestjs/testing';
import { StockResolver } from './stock.resolver';
import { StockService } from './stock.service';

describe('StockResolver', () => {
  let resolver: StockResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockResolver,
        {
          provide: StockService,
          useValue: {
            getAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<StockResolver>(StockResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
