import { ObjectType, Field, InputType } from "@nestjs/graphql";
import { EUnitType } from "generated/prisma";
import { MGqlTrader, MGqlFinancial, MGqlBuyList, MGqlProduct, MGqlTransaction, MGqlStockImage, MGqlSoldStock,  } from "./circular-dependency";


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