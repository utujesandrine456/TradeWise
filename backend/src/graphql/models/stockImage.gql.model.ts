<<<<<<< HEAD
import { Field, Float, ObjectType } from "@nestjs/graphql";
import { EUnitType } from "generated/prisma";
import { MGqlStock } from "../circular-dependency";

@ObjectType()
export class MGqlStockImage {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => Float)
    quantity: number;

    @Field(() => Float)
    low_stock_quantity: number;

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
=======
import { Field, ObjectType } from "@nestjs/graphql";
import { EUnitType } from "generated/prisma";
import { MGqlStock } from "../circular-dependency";

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
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
}