import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { ENTransactionType } from 'generated/prisma';

export type TTransactionCreateProduct = {
    name: string;
    price: number;
    brand?: string;
    quantity: number;
}

export type TTransactionCreateDetails = {
    type: ENTransactionType;
    secondParty: string;
    description: string;
    products: TTransactionCreateProduct[];
}

@InputType()
export class GqlTransactionCreateProductInput {
    @Field(() => String)
    name: String;

    @Field(() => Float)
    price: number;
    
    @Field(() => Int)
    quantity: number;

    @Field(() => String, { nullable: true })
    brand?: string;
}