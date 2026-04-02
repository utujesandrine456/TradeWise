import { Test, TestingModule } from '@nestjs/testing';
import { Notification2Service } from './notification2.service';

describe('Notification2Service', () => {
  let service: Notification2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Notification2Service],
    }).compile();

    service = module.get<Notification2Service>(Notification2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
