import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GqlMCategory } from '../../management/category/category.gqlmodel';
import { GqlMStock } from './stock.gqlmodel';

enum ENGqlProductUnit {
  KG = "KG", // for weight
  Liters = "Liters", // for liquids
  Pieces = "Pieces" // for pieces
}

registerEnumType(ENGqlProductUnit, { name: 'ENGqlProductUnit' });

@ObjectType()
export class GqlMProduct {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => ENGqlProductUnit)
  unit: ENGqlProductUnit;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => GqlMCategory, { nullable: true })
  category?: GqlMCategory;

  @Field(() => GqlMStock, { nullable: true })
  stock?: GqlMStock;
}
