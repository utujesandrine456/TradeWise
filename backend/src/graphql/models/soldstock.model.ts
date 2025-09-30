import { Field, ObjectType } from "@nestjs/graphql";
import { MGqlStock, MGqlProduct } from "./circular-dependency";

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