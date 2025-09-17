import { ProtectedRoutesGuard } from './protected-routes.guard';

describe('ProtectedRoutesGuard', () => {
  it('should be defined', () => {
    expect(new ProtectedRoutesGuard()).toBeDefined();
  });
});
