import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { SendMessage, EPaymentMethod } from "generated/prisma";
import { MGqlTrader } from "../circular-dependency";

registerEnumType(SendMessage, {
  name: "SendMessage"
});

registerEnumType(EPaymentMethod, {
  name: "EPaymentMethod"
});

@ObjectType()
export class MGqlTraderSettings {
  @Field()
  id: string;

  @Field()
  enterpriseDescription: string;

  @Field()
  logo_PublicId: string;

  @Field()
  logoUrl: string;

  @Field()
  name: string;

  @Field()
  evaluationPeriod: number;

  @Field()
  deleteSoldStockAfterEvaluationPeriod: boolean;

  @Field()
  ussdCode: string;

  @Field()
  sendMessage: SendMessage;

  @Field({ nullable: true })
  businessType?: string;

  @Field({ nullable: true })
  industry?: string;

  @Field({ nullable: true })
  foundedYear?: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  businessHours?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  anualRevenue?: number;

  @Field({ nullable: true })
  numberOfEmployees?: number;

  @Field(() => EPaymentMethod, { nullable: true })
  paymentMethod?: EPaymentMethod;

  @Field({ nullable: true })
  targetMarket?: string;

  @Field({ nullable: true })
  competitors?: string;

  @Field({ nullable: true })
  goals?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field()
  traderId: string;

  @Field(() => MGqlTrader)
  trader: MGqlTrader;
}