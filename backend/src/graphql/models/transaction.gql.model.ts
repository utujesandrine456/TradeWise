import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";
import { ENTransactionType } from "generated/prisma";
import { MGqlStock, MGqlFinancial, MGqlTransactionProduct } from "./circular-dependency";

registerEnumType(ENTransactionType, {
    name: "ENTransactionType"
})

@ObjectType()
export class MGqlTransaction {
    @Field()
    id: string;

    @Field(() => ENTransactionType)
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