import { ObjectType, Field } from "@nestjs/graphql";
import { SendMessage } from "generated/prisma";
import { MGqlNotification } from "./notification.gql.model";
import { MGqlStock } from "./stock.gql.model";

@ObjectType()
export class MGqlTrader {
    @Field()
    id: string;

    @Field()
    enterpriseName: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field(() => Date)
    lastLogin: Date;

    @Field()
    resetPasswordToken: string;

    @Field()
    verifyAccountToken: string;

    @Field(() => Date)
    resetPasswordExpires: Date;

    @Field(() => Date)
    verifyAccountExpires: Date;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => MGqlTraderSettings)
    settings: MGqlTraderSettings;

    @Field(() => [MGqlNotification])
    notifications: MGqlNotification[];

    @Field(() => MGqlStock)
    stock: MGqlStock;
}

@ObjectType()
export class MGqlTraderSettings {
    @Field()
    id: string;

    @Field()
    enterpriseDescription: string;

    @Field()
    logo_PublicId: string;

    @Field()
    logoUrl: string;

    @Field()
    name: string;

    @Field()
    evaluationPeriod: number;

    @Field()
    deleteSoldStockAfterEvaluationPeriod: boolean;

    @Field()
    ussdCode: string;

    @Field()
    sendMessage: SendMessage;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field()
    traderId: string;

    @Field(() => MGqlTrader)
    trader: MGqlTrader;
}