import { BadRequestException, Injectable } from '@nestjs/common';
import { EUnitType } from 'generated/prisma';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
    public constructor(
        private readonly prismaService: PrismaService
    ) {}

    public async getStockImages(traderId: string) {
        return await this.prismaService.mStockImage.findMany({
            where: {
                stock: { traderId }
            }
        });
    }

    public async createStockImage(details: { name: string, unit: EUnitType }, traderId: string) {
        try {
            const stock = await this.prismaService.mStock.findUnique({
                where: {
                    traderId
                }
            });
            if (!stock) throw new BadRequestException('Stock not found');

            const stockImage = await this.prismaService.mStockImage.create({
                data: {
                    name: details.name,
                    unit: details.unit,
                    stockId: stock.id
                }
            });

            return stockImage;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException('Stock image already exists');
                }
            }
        }
    }

    public async updateStockImage(details: { name?: string, unit?: EUnitType}, traderId: string, imgId: string) {
        try {
            const stockImage = await this.prismaService.mStockImage.update({
                where: {
                    id: imgId,
                    stock: { traderId }
                },
                data: {
                    name: details.name,
                    unit: details.unit
                }
            });

            return stockImage;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) 
                if (error.code === 'P2025') 
                    throw new BadRequestException('Product not found');
        }
    }

    public async deleteStockImage(traderId: string, imgId: string) {
        try {
            const stockImage = await this.prismaService.mStockImage.delete({
                where: {
                    id: imgId,
                    stock: { traderId }
                }
            });

            return stockImage;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) 
                if (error.code === 'P2025') 
                    throw new BadRequestException('Product not found');
        }
    }
}
