import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EUnitType } from '../../../generated/prisma';

type StockItemInput = {
  name: string;
  category: string; 
  quantity: number;
  unit: EUnitType;
};

type StockImageItem = {
  id: string;
  name: string;
  unit: EUnitType;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

@Controller('stock')
export class StockController {
  constructor(private readonly prisma: PrismaService) {}


  @Post('create-multiple')
  async createMultipleStock(
    @Body() body: { traderId: string; products: StockItemInput[] }
  ): Promise<StockImageItem[]> {
    const { traderId, products } = body;

    if (!traderId) throw new BadRequestException('traderId is required');
    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new BadRequestException('Products array is required');
    }

    // Ensure trader has a stock row in MStock
    const stock = await this.prisma.mStock.upsert({
      where: { traderId },
      update: {},
      create: { traderId },
    });

    const results: StockImageItem[] = [];

    for (const prod of products) {
      const nameLower = (prod.name || '').toLowerCase().trim();
      if (!nameLower) {
        throw new BadRequestException('Product name is required');
      }
      try {
        // Upsert stock image by composite unique (name, stockId)
        const image = await this.prisma.mStockImage.upsert({
          where: { name_stockId: { name: nameLower, stockId: stock.id } },
          create: {
            name: nameLower,
            unit: prod.unit as EUnitType,
            quantity: prod.quantity ?? 0,
            stockId: stock.id,
          },
          update: {
            unit: prod.unit as EUnitType,
            quantity: { increment: prod.quantity ?? 0 },
          },
        });
        results.push(image as unknown as StockImageItem);
      } catch (err: any) {
        console.error('Prisma error:', err);
        throw new BadRequestException(`Failed to add product ${prod.name}: ${err.message}`);
      }
    }

    return results;
  }

}
