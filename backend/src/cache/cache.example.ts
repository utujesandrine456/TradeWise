import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Injectable()
export class ExampleService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Example 1: Manual cache control
  async getCachedData(key: string): Promise<any> {
    // Try to get from cache first
    let data = await this.cacheManager.get(key);
    
    if (!data) {
      // If not in cache, fetch from database/API
      data = await this.fetchFromDatabase(key);
      
      // Store in cache for 5 minutes (300 seconds)
      await this.cacheManager.set(key, data, 300000);
    }
    
    return data;
  }

  // Example 2: Decorator-based caching (automatic)
  @CacheKey('user_profile')
  @CacheTTL(600) // 10 minutes
  async getUserProfile(userId: string): Promise<any> {
    // This method result will be automatically cached
    return await this.fetchUserProfileFromDB(userId);
  }

  // Example 3: Cache invalidation
  async invalidateCache(pattern: string): Promise<void> {
    // Delete specific key
    await this.cacheManager.del(pattern);
    
    // Or clear entire cache
    // await this.cacheManager.reset();
  }

  // Example 4: Cache warming
  async warmCache(): Promise<void> {
    const commonData = await this.getCommonData();
    await this.cacheManager.set('common_data', commonData, 3600000); // 1 hour
  }

  private async fetchFromDatabase(key: string): Promise<any> {
    // Your database logic here
    return { data: `fetched_for_${key}`, timestamp: new Date() };
  }

  private async fetchUserProfileFromDB(userId: string): Promise<any> {
    // Your user profile logic here
    return { userId, name: 'John Doe', lastUpdated: new Date() };
  }

  private async getCommonData(): Promise<any> {
    // Common data that doesn't change often
    return { settings: {}, constants: {} };
  }
}
