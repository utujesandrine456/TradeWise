import { Field, ObjectType } from "@nestjs/graphql";
import { ENFinancialType } from "generated/prisma";
import { MGqlTransaction } from "./transaction.gql.model";
import { MGqlStock } from "./stock.gql.model";

@ObjectType()
export class MGqlFinancial {
    @Field()
    id: string;

    @Field(() => ENFinancialType)
    type: ENFinancialType;

    @Field()
    amount: number;

    @Field()
    description: string;

    @Field()
    collateral: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field()
    stockId: string;

    @Field(() => MGqlStock)
    stock: MGqlStock;

    @Field()
    transactionId: string;

    @Field(() => MGqlTransaction)
    transaction: MGqlTransaction;
}
