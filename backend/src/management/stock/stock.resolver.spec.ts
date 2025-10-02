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
