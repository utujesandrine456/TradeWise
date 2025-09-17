import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GqlMProduct } from '../../graphql/models/product.gqlmodel';

@ObjectType()
export class GqlMCategory {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => [GqlMProduct], { nullable: 'items' })
  products: GqlMProduct[];
}
