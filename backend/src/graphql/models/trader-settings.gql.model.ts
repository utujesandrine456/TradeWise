import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { SendMessage } from "generated/prisma";
import { MGqlTrader } from "./circular-dependency";

registerEnumType(SendMessage, {
  name: "SendMessage"
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

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field()
  traderId: string;

  @Field(() => MGqlTrader)
  trader: MGqlTrader;
}