import { Resolver, Mutation, Args, Query, ResolveField, Float } from '@nestjs/graphql';
import { StockService } from './stock.service';
import { MGqlStock, MGqlStockImage } from 'src/graphql/circular-dependency';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { EUnitType } from 'generated/prisma';
import { IJwtPayload } from 'src/auth/auth.types';
import { UseGuards } from '@nestjs/common';
import { ProtectedRouteGuard } from 'src/custom/guards/protected-route/protected-route.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { GqlStockImageInput } from './stock.types';
import { VerifiedGuard } from 'src/custom/guards/verified/verified.guard';

@UseGuards(VerifiedGuard)
@Resolver()
export class StockImageResolver {
  public constructor(private readonly stockService: StockService) {}

  @Query(() => [MGqlStockImage], { nullable: true })
  public async getStockImages(
    @CurrentUser() userId: IJwtPayload
  ) {
    return await this.stockService.getStockImages(userId.sub);
  }

  @Query(() => MGqlStockImage, { nullable: true })
  public async getStockImage(
    @CurrentUser() userId: IJwtPayload,
    @Args('id') id: string
  ) {
    return await this.stockService.getStockImage(userId.sub, id);
  }
  
  @Mutation(() => MGqlStockImage)
  public async createStockImage(
    @CurrentUser() user: IJwtPayload,
    @Args('name') name: string,
    @Args('unit', { type: () => EUnitType }) unit: EUnitType,
    @Args('low_stock_quantity', { type: () => Float, nullable: true }) low_stock_quantity?: number,
  ) {
    return await this.stockService.createStockImage({ name, unit, low_stock_quantity }, user.sub);
  }
  
  @Mutation(() => [MGqlStockImage])
  public async createMultipleStockImages(
    @CurrentUser() user: IJwtPayload,
    @Args('stockImages', { type: () => [GqlStockImageInput] }) stockImages: GqlStockImageInput[],
  ){
    return await this.stockService.createMultipleStockImages(stockImages, user.sub);
  }
  
  @Mutation(() => MGqlStockImage)
  public async updateStockImage(
    @CurrentUser() user: IJwtPayload,
    @Args('stockImageId') stockImageId: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('unit', { type: () => EUnitType, nullable: true }) unit?: EUnitType,
    @Args('low_stock_quantity', { type: () => Float, nullable: true }) low_stock_quantity?: number,
  ) {
    return await this.stockService.updateStockImage({ unit, name, low_stock_quantity }, user.sub, stockImageId);
  }
  
  @Mutation(() => MGqlStockImage)
  public async deleteStockImage(
    @CurrentUser() user: IJwtPayload,
    @Args('stockImageId') stockImageId: string,
  ) {
    return await this.stockService.deleteStockImage(user.sub, stockImageId);
  }
}
