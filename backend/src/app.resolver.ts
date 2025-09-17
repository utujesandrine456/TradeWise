import { Query, Resolver } from '@nestjs/graphql';

// for testing
@Resolver()
export class AppResolver {
    @Query(() => String)
    public hello(): string {
        return 'Hello World!';
    }
}
