import { Query, Resolver } from '@nestjs/graphql';
import { StockService } from './stock.service';
import { MGqlStock } from 'src/graphql/circular-dependency';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { IJwtPayload } from 'src/auth/auth.types';
import { VerifiedGuard } from 'src/custom/guards/verified/verified.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(VerifiedGuard)
@Resolver()
export class StockResolver {
    public constructor(
        private readonly stockService: StockService,
    ) {}

    @Query(() => MGqlStock, { nullable: true })
    public async getStock(
        @CurrentUser() user: IJwtPayload
    ) {
        return await this.stockService.getStock(user.sub);
    }
}
