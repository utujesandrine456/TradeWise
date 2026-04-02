<<<<<<< HEAD
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
    @Query(() => String)
    public getHello() {
        return "Hello world"
    }
}
=======
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
    @Query(() => String)
    public getHello() {
        return "Hello world"
    }
}
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
