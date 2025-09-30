import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";
import { ENNotificationFilterType, ENNotificationImpact } from "generated/prisma";
import { MGqlTrader } from "./circular-dependency";

registerEnumType(ENNotificationImpact, {
  name: "ENNotificationImpact"
});

registerEnumType(ENNotificationFilterType, {
  name: "ENNotificationFilterType"
});

@ObjectType()
export class MGqlNotification {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field()
    message: string;

    @Field(() => ENNotificationImpact)
    impact: ENNotificationImpact;

    @Field(() => ENNotificationFilterType)
    filterType: ENNotificationFilterType;

    @Field()
    type: string;

    @Field()
    read: boolean;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    //relations
    @Field()
    traderId: string;

    @Field(() => MGqlTrader)
    trader: MGqlTrader;
}