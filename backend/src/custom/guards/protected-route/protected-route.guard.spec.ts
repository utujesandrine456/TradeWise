import { ProtectedRouteGuard } from './protected-route.guard';

describe('ProtectedRouteGuard', () => {
  it('should be defined', () => {
    expect(new ProtectedRouteGuard()).toBeDefined();
  });
});
