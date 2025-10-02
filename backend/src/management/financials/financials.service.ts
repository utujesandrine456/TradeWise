import { BadRequestException, Injectable } from '@nestjs/common';
import { TFinancialCreateDetails } from './financials.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateUlid } from 'id-tools'

@Injectable()
export class FinancialsService {
  public constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async create(details: TFinancialCreateDetails, traderId: string) {
    const { type, amount, description, collateral, deadline } = details;
    const stock = await this.prismaService.mStock.findUnique({
      where: { traderId },
    });
    if (!stock) throw new BadRequestException("Stock not found for trader");
    
    const newFinancial = await this.prismaService.mFinancial.create({
      data: {
        id: generateUlid(),
        type, collateral,
        description, amount,
        stockId: stock.id,
        deadline: deadline ?? undefined,
      },
      include: {
        stock: {
          include: { trader: true }
        },
        transaction: true
      }
    });

    return newFinancial;
  }

  public async getFinancials(traderId: string) {
    const stock = await this.prismaService.mStock.findUnique({
      where: { traderId },
    });
    if (!stock) throw new BadRequestException("Stock not found for trader");
    
    const financials = await this.prismaService.mFinancial.findMany({
      where: { stockId: stock.id },
      orderBy: { createdAt: 'desc' }, // from the latest
      include: {
        stock: {
          include: { trader: true }
        },
        transaction: true
      }
    });
    
    return financials;
  }

  public async getFinancial(financialId: string, traderId: string) {
    const stock = await this.prismaService.mStock.findUnique({
      where: { traderId }
    });
    if (!stock) throw new BadRequestException("Stock not found for trader");

    const financial = await this.prismaService.mFinancial.findFirst({
      where: { id: financialId, stockId: stock.id },      
      include: {
        stock: {
          include: { trader: true }
        },
        transaction: true
      }
    });
    if (!financial) throw new BadRequestException("Financial not found");
    
    return financial;
  }

  public async markAsPaidBack(financialId: string, traderId: string) {
    const stock = await this.prismaService.mStock.findUnique({
      where: { traderId }
    });
    if (!stock) throw new BadRequestException("Stock not found for trader");

    const financial = await this.prismaService.mFinancial.update({
      where: { id: financialId, stockId: stock.id },
      data: { isPaidBack: true }
    });
    if (!financial) throw new BadRequestException("Financial not found");

    return financial;
  }
}
