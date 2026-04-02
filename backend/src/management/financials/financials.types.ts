import { InputType, Field, Float } from "@nestjs/graphql";
import { ENFinancialType } from "generated/prisma"

export type TFinancialCreateDetails = {
    type: ENFinancialType;
    amount: number;
    description: string;
    collateral?: string;
    deadline?: Date;
}

@InputType()
export class GqlFinancialCreateInput {
    @Field(() => ENFinancialType)
    type: ENFinancialType;

    @Field(() => Float)
    amount: number;

    @Field(() => Date, { nullable: true })
    deadline?: Date;

    @Field()
    description: string;

    @Field({ nullable: true })
    collateral?: string;
}

@InputType()
export class GqlFinancialUpdateInput {
    @Field(() => Float, { nullable: true })
    amount?: number;
    
    @Field(() => Date, { nullable: true })
    deadline?: Date;
    
    @Field({ nullable: true, })
    description?: string;
    
    @Field({ nullable: true })
    collateral?: string;
}