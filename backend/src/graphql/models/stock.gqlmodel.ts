import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GqlMTrader } from './trader.gqlmodel';
import { GqlMProduct } from './product.gqlmodel';

@ObjectType()
export class GqlMStock {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => GqlMTrader, { nullable: true })
  trader?: GqlMTrader;

  @Field(() => GqlMProduct, { nullable: true })
  product?: GqlMProduct;
}
