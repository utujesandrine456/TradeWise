import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const isDev = configService.get<string>('NODE_ENV') === 'development';

        if (redisUrl && !isDev) {
          return {
            store: redisStore,
            url: redisUrl,
            ttl: 3600, 
            max: 100,
          };
        }

        return {
          ttl: 300, 
          max: 100,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule { }
