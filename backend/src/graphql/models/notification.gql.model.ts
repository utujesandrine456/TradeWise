import { ObjectType, Field } from "@nestjs/graphql";
import { ENNotificationFilterType, ENNotificationImpact } from "generated/prisma";
import { MGqlTrader } from "./trader.gql.model";

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