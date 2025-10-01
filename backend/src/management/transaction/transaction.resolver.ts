import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { MGqlTransaction } from 'src/graphql/circular-dependency';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { IJwtPayload } from 'src/auth/auth.types';
import { ENTransactionType } from 'generated/prisma';
import { GqlTransactionCreateProductInput, TTransactionCreateProduct } from './transaction.types';

@Resolver()
export class TransactionResolver {
  public constructor(private readonly transactionService: TransactionService) {}

  @Query(() => MGqlTransaction)
  public async getTransaction(
    @CurrentUser() user: IJwtPayload,
    @Args('transactionId') transactionId: string,
  ) {
    return await this.transactionService.getTransactionById(user.sub, transactionId);
  }
  
  @Query(() => [MGqlTransaction])
  public async getAllTransactions(
    @CurrentUser() user: IJwtPayload,
    @Args('type', {type: () => ENTransactionType, nullable: true }) type?: ENTransactionType, // for filtering
  ) {
    return await this.transactionService.getAllTransactions(user.sub, type);
  }

  @Mutation(() => MGqlTransaction)
  public async createTransaction(
    @CurrentUser() user: IJwtPayload,
    @Args('type', { type: () => ENTransactionType }) type: ENTransactionType,
    @Args('products', { type: () => [GqlTransactionCreateProductInput], }) products: TTransactionCreateProduct[],
    @Args('description') description: string,
    @Args('secondParty') secondParty: string,
  ) {
    return await this.transactionService.createTransaction(user.sub, { type, products, description, secondParty });
  }
}
