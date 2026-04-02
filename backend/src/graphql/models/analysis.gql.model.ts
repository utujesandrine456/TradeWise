import { Field, ObjectType, Float } from "@nestjs/graphql";
import { MGqlTransaction, MGqlProduct, MGqlStock } from "../circular-dependency";

@ObjectType()
class ProductMap {
  @Field(() => [MGqlProduct])
  bought: MGqlProduct[];

  @Field(() => [MGqlProduct])
  sold: MGqlProduct[];
}

@ObjectType()
class FinanceMap {
  @Field(() => Float)
  credits: number;

  @Field(() => Float)
  debits: number;
}

@ObjectType()
class PeriodMap {
  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  endDate: Date;
}

@ObjectType('Analysis')
export class MGqlStockAnalysis {
  @Field(() => PeriodMap)
  analysisPeriod: PeriodMap; // startDate, endDate
  //start: more past, end: more recent 

  @Field(() => MGqlStock)
  stock: MGqlStock;

  @Field(() => ProductMap)
  products: ProductMap; // bought & sold products

  @Field(() => [MGqlTransaction])
  transactions: MGqlTransaction[];

  @Field(() => Float)
  // Total revenue from sold products
  totalSales: number;

  @Field(() => Float)
  totalPurchases: number; // Total cost from bought products

  @Field(() => Float)
  profit: number; // totalSales - totalPurchases (can be negative: loss)

  @Field(() => FinanceMap)
  finance: FinanceMap // [credits, debits]
}
