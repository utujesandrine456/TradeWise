<<<<<<< HEAD
import { Field, ObjectType } from "@nestjs/graphql";
import { MGqlStock, MGqlProduct } from "../circular-dependency";

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
=======
import { Field, ObjectType } from "@nestjs/graphql";
import { MGqlStock, MGqlProduct } from "../circular-dependency";

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
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
}