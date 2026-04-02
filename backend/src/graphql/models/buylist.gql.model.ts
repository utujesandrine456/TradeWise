<<<<<<< HEAD
import { Field, ObjectType } from "@nestjs/graphql";
import { MGqlStock } from "../circular-dependency";

@ObjectType()
export class MGqlBuyList {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    quantity?: number;

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
import { MGqlStock } from "../circular-dependency";

@ObjectType()
export class MGqlBuyList {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    quantity?: number;

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