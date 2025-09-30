import { ObjectType, Field } from "@nestjs/graphql";
import { MGqlSoldStock, MGqlStockImage, MGqlStock } from "./circular-dependency";

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
