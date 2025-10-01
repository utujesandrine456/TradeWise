import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { MGqlNotification } from "./notification.gql.model";
import { MGqlStock, MGqlTraderSettings } from "../circular-dependency";
import { EUnitType } from "generated/prisma";

registerEnumType(EUnitType, {
  name: "EUnitType"
});

@ObjectType()
export class MGqlTrader {
  @Field()
  id: string;

  @Field()
  enterpriseName: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => Date)
  lastLogin: Date;

  @Field()
  resetPasswordToken: string;

  @Field()
  verifyAccountToken: string;

  @Field(() => Date)
  resetPasswordExpires: Date;

  @Field(() => Date)
  verifyAccountExpires: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => MGqlTraderSettings)
  settings: MGqlTraderSettings;

  @Field(() => [MGqlNotification])
  notifications: MGqlNotification[];

  @Field(() => MGqlStock)
  stock: MGqlStock;
}