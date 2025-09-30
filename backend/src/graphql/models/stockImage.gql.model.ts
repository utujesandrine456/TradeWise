import { Field, ObjectType } from "@nestjs/graphql";
import { EUnitType } from "generated/prisma";
import { MGqlStock } from "./circular-dependency";

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