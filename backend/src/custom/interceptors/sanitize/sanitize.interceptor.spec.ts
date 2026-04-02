import { PasswordSanitizeInterceptor } from './sanitize.interceptor';

describe('PasswordSanitizeInterceptor', () => {
  it('should be defined', () => {
    expect(new PasswordSanitizeInterceptor()).toBeDefined();
  });
});
