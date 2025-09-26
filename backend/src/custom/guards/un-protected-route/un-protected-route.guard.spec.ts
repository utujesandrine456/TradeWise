import { UnProtectedRouteGuard } from './un-protected-route.guard';

describe('UnProtectedRouteGuard', () => {
  it('should be defined', () => {
    expect(new UnProtectedRouteGuard()).toBeDefined();
  });
});
