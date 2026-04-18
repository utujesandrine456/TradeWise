import { Field, Float, InputType } from "@nestjs/graphql";
import { EUnitType } from "generated/prisma";

@InputType()
export class GqlStockImageInput {
    @Field()
    name: string;

    @Field()
    unit: EUnitType;

    @Field(() => Float, { nullable: true, })
    low_stock_quantity?: number;
}