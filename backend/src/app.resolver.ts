import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
    @Query(() => String)
    public getHello() {
        return "Hello world"
    }
}
