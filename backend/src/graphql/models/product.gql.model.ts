<<<<<<< HEAD
import { ObjectType, Field, Float } from "@nestjs/graphql";
import { MGqlSoldStock, MGqlStockImage, MGqlStock } from "../circular-dependency";

@ObjectType()
export class MGqlProduct {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => Float)
    price: number;

    @Field({ nullable: true })
    brand?: string;

    @Field()
    quantity: number;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field()
    stockImageId: string;

    @Field(() => MGqlStockImage)
    stockImage: MGqlStockImage;

    @Field(() => [MGqlSoldStock])
    soldStock: MGqlSoldStock[];
}
=======
import { ObjectType, Field, Float } from "@nestjs/graphql";
import { MGqlSoldStock, MGqlStockImage, MGqlStock } from "../circular-dependency";

@ObjectType()
export class MGqlProduct {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => Float)
    price: number;

    @Field({ nullable: true })
    brand?: string;

    @Field()
    quantity: number;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field()
    stockImageId: string;

    @Field(() => MGqlStockImage)
    stockImage: MGqlStockImage;

    @Field(() => [MGqlSoldStock])
    soldStock: MGqlSoldStock[];
}
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
