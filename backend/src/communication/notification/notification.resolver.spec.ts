import { Test, TestingModule } from '@nestjs/testing';
import { NotificationResolver } from './notification.resolver';

describe('NotificationResolver', () => {
  let resolver: NotificationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationResolver],
    }).compile();

    resolver = module.get<NotificationResolver>(NotificationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
