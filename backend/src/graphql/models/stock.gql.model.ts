import { ObjectType, Field } from "@nestjs/graphql";
import { EUnitType } from "generated/prisma";
import { MGqlTrader } from "./trader.gql.model";
import { MGqlFinancial } from "./financial.gql.model";
import { MGqlBuyList, MGqlProduct } from "./product.gql.model";
import { MGqlTransaction } from "./transaction.gql.model";

@ObjectType()
export class MGqlStockImage {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => EUnitType)
    unit: EUnitType;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field()
    stockId: string;

    @Field(() => MGqlStock)
    stock: MGqlStock;
}

@ObjectType()
export class MGqlSoldStock {
    @Field()
    id: string;

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
}

@ObjectType()
export class MGqlStock {
    @Field()
    id: string;

    @Field()
    markAsBought: boolean;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field()
    traderId: string;

    @Field(() => MGqlTrader)
    trader: MGqlTrader;

    @Field(() => [MGqlStockImage])
    images: MGqlStockImage[];

    @Field(() => [MGqlProduct])
    products: MGqlProduct[];

    @Field(() => [MGqlTransaction])
    transactions: MGqlTransaction[];

    @Field(() => [MGqlFinancial])
    financials: MGqlFinancial[];

    @Field(() => [MGqlBuyList])
    buyList: MGqlBuyList[];

    @Field(() => [MGqlSoldStock])
    soldStock: MGqlSoldStock[];
}