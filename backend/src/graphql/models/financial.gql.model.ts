import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { ENFinancialType } from "generated/prisma";
import { MGqlStock, MGqlTransaction } from "../circular-dependency";

registerEnumType(ENFinancialType, {
    name: "ENFinancialType"
})

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
