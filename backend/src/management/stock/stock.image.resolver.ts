<<<<<<< HEAD
import { Resolver, Mutation, Args, Query, ResolveField, Float } from '@nestjs/graphql';
=======
import { Resolver, Mutation, Args, Query, ResolveField } from '@nestjs/graphql';
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
import { StockService } from './stock.service';
import { MGqlStock, MGqlStockImage } from 'src/graphql/circular-dependency';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { EUnitType } from 'generated/prisma';
import { IJwtPayload } from 'src/auth/auth.types';
import { UseGuards } from '@nestjs/common';
import { ProtectedRouteGuard } from 'src/custom/guards/protected-route/protected-route.guard';
import { PrismaService } from 'src/prisma/prisma.service';
<<<<<<< HEAD
import { GqlStockImageInput } from './stock.types';
import { VerifiedGuard } from 'src/custom/guards/verified/verified.guard';

@UseGuards(VerifiedGuard)
=======

>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
@Resolver()
export class StockImageResolver {
  public constructor(private readonly stockService: StockService) {}

  @Query(() => [MGqlStockImage], { nullable: true })
<<<<<<< HEAD
=======
  @UseGuards(ProtectedRouteGuard)
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
  public async getStockImages(
    @CurrentUser() userId: IJwtPayload
  ) {
    return await this.stockService.getStockImages(userId.sub);
  }

  @Query(() => MGqlStockImage, { nullable: true })
<<<<<<< HEAD
=======
  @UseGuards(ProtectedRouteGuard)
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
  public async getStockImage(
    @CurrentUser() userId: IJwtPayload,
    @Args('id') id: string
  ) {
    return await this.stockService.getStockImage(userId.sub, id);
  }
  
  @Mutation(() => MGqlStockImage)
<<<<<<< HEAD
=======
  @UseGuards(ProtectedRouteGuard)
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
  public async createStockImage(
    @CurrentUser() user: IJwtPayload,
    @Args('name') name: string,
    @Args('unit', { type: () => EUnitType }) unit: EUnitType,
<<<<<<< HEAD
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
=======
  ) {
    return await this.stockService.createStockImage({ name, unit }, user.sub);
  }
  
  @Mutation(() => MGqlStockImage)
  @UseGuards(ProtectedRouteGuard)
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
  public async updateStockImage(
    @CurrentUser() user: IJwtPayload,
    @Args('stockImageId') stockImageId: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('unit', { type: () => EUnitType, nullable: true }) unit?: EUnitType,
<<<<<<< HEAD
    @Args('low_stock_quantity', { type: () => Float, nullable: true }) low_stock_quantity?: number,
  ) {
    return await this.stockService.updateStockImage({ unit, name, low_stock_quantity }, user.sub, stockImageId);
  }
  
  @Mutation(() => MGqlStockImage)
=======
  ) {
    return await this.stockService.updateStockImage({ unit, name }, user.sub, stockImageId);
  }
  
  @Mutation(() => MGqlStockImage)
  @UseGuards(ProtectedRouteGuard)
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
  public async deleteStockImage(
    @CurrentUser() user: IJwtPayload,
    @Args('stockImageId') stockImageId: string,
  ) {
    return await this.stockService.deleteStockImage(user.sub, stockImageId);
  }
}
