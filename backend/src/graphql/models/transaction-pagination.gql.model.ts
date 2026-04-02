import { Field, ObjectType, Int } from '@nestjs/graphql';
import { MGqlTransaction } from './transaction.gql.model';

@ObjectType()
export class PaginationInfo {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  totalPages: number;

  @Field()
  hasNext: boolean;

  @Field()
  hasPrev: boolean;
}

@ObjectType()
export class MGqlTransactionPagination {
  @Field(() => [MGqlTransaction])
  data: MGqlTransaction[];

  @Field(() => PaginationInfo)
  pagination: PaginationInfo;
}

@ObjectType()
export class MGqlTransactionList {
  @Field(() => [MGqlTransaction])
  transactions: MGqlTransaction[];
}
