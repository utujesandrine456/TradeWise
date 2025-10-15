import { BadRequestException, Injectable } from '@nestjs/common';
import { EUnitType } from 'generated/prisma';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prismaService: PrismaService) {}


  public async getStockImages(traderId: string) {
    return this.prismaService.mStockImage.findMany({
      where: { stock: { traderId } },
      include: { stock: { include: { trader: true } } }
    }) ?? [];
  }



  public async getStockImage(traderId: string, stockImgId: string) {
    const stockImage = await this.prismaService.mStockImage.findFirst({
      where: { id: stockImgId, stock: { traderId } },
      include: { stock: { include: { trader: true } } }
    });

    if (!stockImage) throw new BadRequestException('Stock image not found');
    return stockImage;
  }



  public async createStockImage(
    details: { name: string; unit: EUnitType },
    traderId: string
  ) {
    const { name, unit } = details;
    const nameLower = name.toLowerCase();

    const stock = await this.prismaService.mStock.findFirst({ where: { traderId } });
    if (!stock) throw new BadRequestException('Stock not found');

    try {
      return await this.prismaService.mStockImage.create({
        data: { name: nameLower, unit, stockId: stock.id },
        include: { stock: { include: { trader: true } } }
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('Stock image already exists');
      }
      throw error;
    }
  }



  public async updateStockImage(
    details: { name?: string; unit?: EUnitType },
    traderId: string,
    imgId: string
  ) {
    const stockImage = await this.prismaService.mStockImage.findFirst({
      where: { id: imgId, stock: { traderId } }
    });
    if (!stockImage) throw new BadRequestException('Stock image not found');

    return this.prismaService.mStockImage.update({
      where: { id: imgId },
      data: { name: details.name, unit: details.unit },
      include: { stock: { include: { trader: true } } }
    });
  }



  public async deleteStockImage(traderId: string, imgId: string) {
    const stockImage = await this.prismaService.mStockImage.findFirst({
      where: { id: imgId, stock: { traderId } }
    });
    if (!stockImage) throw new BadRequestException('Stock image not found');

    return this.prismaService.mStockImage.delete({
      where: { id: imgId },
      include: { stock: { include: { trader: true } } }
    });
  }



  public async getStock(traderId: string) {
    return this.prismaService.mStock.findUnique({
      where: { traderId },
      include: {
        trader: true,
        images: { include: { products: true } },
        transactions: { include: { products: true, financials: true } },
        financials: true,
        buyList: true,
      }
    });
  }

  public async createStock(
      traderId: string,
      data: { name: string; category: string; unit: EUnitType; quantity?: number }
    ) {
      
      return this.prismaService.mStock.create({
        data: {
          ...data,
          traderId,
        },
      });
  }
  
  

  public async getStockById(id: string) {
    const stock = await this.prismaService.stock.findUnique({ where: { id } });
    if (!stock) throw new BadRequestException('Stock not found');
    return stock;
  }
}
