import { Field, InputType } from "@nestjs/graphql";
import { EUnitType } from "generated/prisma";

@InputType()
export class GqlStockImageInput {
    @Field()
    name: string;

    @Field()
    unit: EUnitType;

    @Field()
    quantity: Int16Array
}