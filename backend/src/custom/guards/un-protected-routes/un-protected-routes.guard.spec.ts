import { UnProtectedRoutesGuard } from './un-protected-routes.guard';

describe('UnProtectedRoutesGuard', () => {
  it('should be defined', () => {
    expect(new UnProtectedRoutesGuard()).toBeDefined();
  });
});
