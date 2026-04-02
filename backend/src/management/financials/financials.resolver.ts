import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { FinancialsService } from './financials.service';
import { MGqlFinancial } from 'src/graphql/circular-dependency';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { IJwtPayload } from 'src/auth/auth.types';
import { GqlTransactionCreateProductInput } from '../transaction/transaction.types';
import { ENFinancialType } from 'generated/prisma';
import { UseGuards } from '@nestjs/common';
import { VerifiedGuard } from 'src/custom/guards/verified/verified.guard';
import { GqlFinancialUpdateInput } from './financials.types';

@UseGuards(VerifiedGuard)
@Resolver()
export class FinancialsResolver {
  public constructor(private readonly financialsService: FinancialsService) {}

  @Mutation(() => MGqlFinancial)
  public createFinancial(
    @CurrentUser() user: IJwtPayload,
    @Args('type', { type: () => ENFinancialType }) type: ENFinancialType,
    @Args('amount') amount: number,
    @Args('description') description: string,
    @Args('collateral', { nullable: true }) collateral?: string,
    @Args('deadline', { nullable: true }) deadline?: Date,
  ) {
    return this.financialsService.create({ type, amount, description, collateral, deadline }, user.sub);
  }

  @Query(() => [MGqlFinancial])
  public getFinancials(@CurrentUser() user: IJwtPayload) {
    return this.financialsService.getFinancials(user.sub);
  }

  @Query(() => MGqlFinancial)
  public getFinancial(
    @CurrentUser() user: IJwtPayload,
    @Args('financialId') financialId: string
  ) {
    return this.financialsService.getFinancial(financialId, user.sub);
  }

  @Mutation(() => MGqlFinancial)
  public markAsPaidBack(
    @CurrentUser() user: IJwtPayload,
    @Args('financialId') financialId: string,
  ) {
    return this.financialsService.markAsPaidBack(financialId, user.sub);
  }

  @Mutation(() => MGqlFinancial)
  public updateFinancial(
    @CurrentUser() user: IJwtPayload,
    @Args('financialId') financialId: string,
    @Args('input') input: GqlFinancialUpdateInput,
  ) {
    return this.financialsService.updateFinancial(financialId, input, user.sub);
  }
}
