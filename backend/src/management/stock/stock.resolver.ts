import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { StockService } from './stock.service';
import { MGqlStockImage } from 'src/graphql/models/circular-dependency';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { EUnitType } from 'generated/prisma';
import { IJwtPayload } from 'src/auth/auth.types';
import { UseGuards } from '@nestjs/common';
import { ProtectedRouteGuard } from 'src/custom/guards/protected-route/protected-route.guard';

@UseGuards(ProtectedRouteGuard)
@Resolver()
export class StockResolver {
  public constructor(private readonly stockService: StockService) {}

  @Query(() => [MGqlStockImage])
  public async getStockImages(
    @CurrentUser() userId: IJwtPayload
  ) {
    return await this.stockService.getStockImages(userId.sub);
  }

  @Mutation(() => MGqlStockImage)
  public async createStockImage(
    @CurrentUser() user: IJwtPayload,
    @Args('name') name: string,
    @Args('unit', { type: () => EUnitType }) unit: EUnitType,
  ) {
    return await this.stockService.createStockImage({ name, unit }, user.sub);
  }

  @Mutation(() => MGqlStockImage)
  public async updateStockImage(
    @CurrentUser() user: IJwtPayload,
    @Args('stockImageId') stockImageId: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('unit', { type: () => EUnitType, nullable: true }) unit?: EUnitType,
  ) {
    return await this.stockService.updateStockImage({ unit, name }, user.sub, stockImageId);
  }

  @Mutation(() => MGqlStockImage)
  public async deleteStockImage(
    @CurrentUser() user: IJwtPayload,
    @Args('stockImageId') stockImageId: string,
  ) {
    return await this.stockService.deleteStockImage(user.sub, stockImageId);
  }
}
