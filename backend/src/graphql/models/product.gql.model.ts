import { ObjectType, Field } from "@nestjs/graphql";
import { MGqlSoldStock, MGqlStockImage, MGqlStock } from "./stock.gql.model";

ObjectType()
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
}

@ObjectType()
export class MGqlProduct {
    @Field()
    id: string;

    @Field()
    name: string;

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
