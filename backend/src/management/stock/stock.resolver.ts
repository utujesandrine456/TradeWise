import { Resolver } from '@nestjs/graphql';
import { StockService } from './stock.service';

@Resolver()
export class StockResolver {
    public constructor(private readonly stockService: StockService) {}
}
