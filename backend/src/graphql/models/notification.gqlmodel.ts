import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GqlMTrader } from './trader.gqlmodel';

enum ENQqlNotificationImpact {
  Low = "Low",
  Medium = "Medium",
  High = "High"
}

enum ENQqlNotificationFilterType {
  INFO = "INFO",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS"
}

registerEnumType(ENQqlNotificationImpact, { name: 'ENQqlNotificationImpact' });
registerEnumType(ENQqlNotificationFilterType, { name: 'ENQqlNotificationType' });

@ObjectType()
export class GqlMNotification {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => ENQqlNotificationImpact)
  impact: ENQqlNotificationImpact;

  @Field(() => ENQqlNotificationFilterType)
  type: ENQqlNotificationFilterType;

  @Field()
  read: boolean;

  // Relations
  @Field(() => GqlMTrader)
  trader: GqlMTrader;
}
