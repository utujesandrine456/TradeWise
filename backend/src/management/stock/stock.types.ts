<<<<<<< HEAD
import { Field, Float, InputType } from "@nestjs/graphql";
=======
import { Field, InputType } from "@nestjs/graphql";
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
import { EUnitType } from "generated/prisma";

@InputType()
export class GqlStockImageInput {
    @Field()
    name: string;

    @Field()
    unit: EUnitType;

<<<<<<< HEAD
    @Field(() => Float, { nullable: true, })
    low_stock_quantity?: number;
=======
    @Field()
    quantity: Int16Array
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
}