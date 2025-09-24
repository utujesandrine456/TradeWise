import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GqlMStock } from './stock.gqlmodel';
import { GqlMNotification } from './notification.gqlmodel';

@ObjectType()
export class GqlMTrader {
  @Field(() => ID)
  id: string;

  @Field()
  enterpriseName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field({ nullable: true })
  resetPasswordToken?: string;

  @Field({ nullable: true })
  resetPasswordExpires?: Date;

  @Field({ nullable: true })
  verifyAccountToken?: string;

  @Field({ nullable: true })
  verifyAccountExpires?: Date;

  @Field()
  lastLogin: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => GqlMStock, { nullable: true })
  stock?: GqlMStock;

  @Field(() => [GqlMNotification], { nullable: 'items' })
  notifications: GqlMNotification[];
}
