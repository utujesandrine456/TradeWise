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
    isPaidBack: number;

    @Field(() => Date, { nullable: true })
    deadline?: number;

    @Field()
    description: string;

    @Field({ nullable: true })
    collateral?: string;

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

    @Field(() => MGqlTransaction, { nullable: true })
    transaction: MGqlTransaction;
}
