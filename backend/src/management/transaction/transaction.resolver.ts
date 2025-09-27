import { Resolver, Mutation } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';

@Resolver()
export class TransactionResolver {
  public constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => String)
  public async createTransaction() {
    return "Data send"
  }
}
