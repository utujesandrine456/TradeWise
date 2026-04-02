<<<<<<< HEAD
import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";
import { ENTransactionType } from "generated/prisma";
import { MGqlStock, MGqlFinancial, MGqlProduct } from "../circular-dependency";

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

    @Field(() => [MGqlProduct])
    products: MGqlProduct[];

    @Field(() => [MGqlFinancial], { nullable: true })
    financials?: MGqlFinancial[];
=======
import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";
import { ENTransactionType } from "generated/prisma";
import { MGqlStock, MGqlFinancial, MGqlProduct } from "../circular-dependency";

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

    @Field(() => [MGqlProduct])
    products: MGqlProduct[];

    @Field(() => [MGqlFinancial], { nullable: true })
    financials?: MGqlFinancial[];
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
}