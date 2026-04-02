import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { IJwtPayload } from 'src/auth/auth.types';
import { VerifiedGuard } from 'src/custom/guards/verified/verified.guard';
import { UseGuards, UseFilters } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { MGqlTransaction } from 'src/graphql/models/transaction.gql.model';
import { MGqlTransactionPagination, MGqlTransactionList } from 'src/graphql/models/transaction-pagination.gql.model';
import { ENTransactionType } from 'generated/prisma';
import { TTransactionCreateDetails } from './transaction.types';
import { ApolloErrorFilter } from 'src/custom/filters/ApolloError.filter';
import { PaginationOptions } from 'src/common/pagination';
import { FinancialsService } from '../financials/financials.service';
import { GqlTransactionCreateProductInput, TTransactionCreateProduct } from './transaction.types';
import { GqlFinancialCreateInput } from '../financials/financials.types';

@UseGuards(VerifiedGuard)
@Resolver()
export class TransactionResolver {
  public constructor(
    private readonly transactionService: TransactionService,
  ) {}

  @Query(() => MGqlTransaction)
  public async getTransaction(
    @CurrentUser() user: IJwtPayload,
    @Args('transactionId') transactionId: string,
  ) {
    return await this.transactionService.getTransactionById(user.sub, transactionId);
  }

  @Query(() => MGqlTransactionPagination)
  public async getAllTransactions(
    @CurrentUser() user: IJwtPayload,
    @Args('type', {type: () => ENTransactionType, nullable: true }) type?: ENTransactionType, // for filtering
    @Args('page', { type: () => Number, nullable: true }) page?: number,
    @Args('limit', { type: () => Number, nullable: true }) limit?: number,
    @Args('fields', { type: () => [String], nullable: true }) fields?: string[],
  ) {
    return await this.transactionService.getAllTransactions(user.sub, type, { page, limit }, fields);
  }

  @Mutation(() => MGqlTransaction)
  @UseFilters(ApolloErrorFilter)
  public async createTransaction(
    @CurrentUser() user: IJwtPayload,
    @Args('type', { type: () => ENTransactionType }) type: ENTransactionType,
    @Args('products', { type: () => [GqlTransactionCreateProductInput], }) products: TTransactionCreateProduct[],
    @Args('description') description: string,
    @Args('secondParty') secondParty: string,
    @Args('financialDetails', { type: () => GqlFinancialCreateInput, nullable: true }) financialDetails?: GqlFinancialCreateInput,
  ) {
    const transaction = await this.transactionService.createTransaction(
      user.sub, 
      { type, products, description, secondParty },
      financialDetails
    );

    return transaction;
  }
}