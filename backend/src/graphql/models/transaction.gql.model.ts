import { ObjectType, Field } from "@nestjs/graphql";
import { ENTransactionType } from "generated/prisma";
import { MGqlStock } from "./stock.gql.model";
import { MGqlFinancial } from "./financial.gql.model";

@ObjectType()
export class MGqlTransactionProduct {
    @Field()
    id: string;

    @Field()
    amount: number;

    @Field()
    price: number;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field()
    transactionId: string;

    @Field(() => MGqlTransaction)
    transaction: MGqlTransaction;
}

@ObjectType()
export class MGqlTransaction {
    @Field()
    id: string;

    @Field()
    type: ENTransactionType;

    @Field()
    description: string;

    @Field()
    secondParty: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field()
    stockId: string;

    @Field(() => MGqlStock)
    stock: MGqlStock;

    @Field(() => [MGqlTransactionProduct])
    products: MGqlTransactionProduct[];

    @Field(() => [MGqlFinancial])
    financials: MGqlFinancial[];
}