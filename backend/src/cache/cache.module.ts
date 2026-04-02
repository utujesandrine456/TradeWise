import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const isDev = configService.get<string>('NODE_ENV') === 'development';
        
        // Use Redis in production, memory cache in development
        if (redisUrl && !isDev) {
          return {
            store: redisStore,
            url: redisUrl,
            ttl: 3600, // 1 hour default TTL
            max: 100, // maximum number of items in cache
          };
        }
        
        // Fallback to in-memory cache
        return {
          ttl: 300, // 5 minutes for memory cache
          max: 100,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
