import { Test, TestingModule } from '@nestjs/testing';
import { FinancialsService } from './financials.service';

describe('FinancialsService', () => {
  let service: FinancialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialsService],
    }).compile();

    service = module.get<FinancialsService>(FinancialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
