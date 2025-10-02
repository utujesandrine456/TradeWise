import { Field, ObjectType, Float } from "@nestjs/graphql";
import { MGqlStock } from "./stock.gql.model";
import { MGqlProduct } from "./product.gql.model";

@ObjectType('Analysis')
export class MGqlStockAnalysis {
    @Field(() => MGqlStock)
    stock: MGqlStock;

    @Field(() => [MGqlProduct])
    soldProducts: MGqlProduct[];

    @Field(() => [MGqlProduct])
    boughtProducts: MGqlProduct[];

    @Field(() => Float)
    totalSales: number; // Total revenue from sold products

    @Field(() => Float)
    totalPurchases: number; // Total cost from bought products

    @Field(() => Float)
    profit: number; // totalSales - totalPurchases (can be negative: loss)

    @Field(() => [Date, Date])
    analysisPeriod: [Date, Date]; // [startDate, endDate]

    @Field(() => [Float, Float])
    finance: [number, number] // [credits, debits]
}