import { Field, ObjectType } from "@nestjs/graphql";
import { MGqlTransaction } from './circular-dependency'

@ObjectType()
export class MGqlTransactionProduct {
    @Field()
    id: string;

    @Field()
    amount: number;

    @Field()
    price: number;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field()
    transactionId: string;

    @Field(() => MGqlTransaction)
    transaction: MGqlTransaction;
}