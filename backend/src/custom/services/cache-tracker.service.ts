import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheTrackerService {
    trackCacheHit(context: any, operation: string) {
        if (context?._graphqlLogger) {
            context._graphqlLogger.cacheHits++;
        }
    }

    trackDbQuery(context: any, operation: string) {
        if (context?._graphqlLogger) {
            context._graphqlLogger.dbQueries++;
        }
    }
}
