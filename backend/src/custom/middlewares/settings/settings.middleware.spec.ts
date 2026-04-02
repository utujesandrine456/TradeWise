import { SettingsMiddleware } from './settings.middleware';

describe('SettingsMiddleware', () => {
  it('should be defined', () => {
    expect(new SettingsMiddleware()).toBeDefined();
  });
});
