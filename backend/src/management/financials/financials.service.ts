import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { GqlFinancialUpdateInput, TFinancialCreateDetails } from './financials.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class FinancialsService {
  public constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  public async findStock(traderId: string) {
    const stock = await this.prismaService.mStock.findUnique({ where: { traderId } });
    if (!stock) 
      throw new BadRequestException("Stock not found for trader");

    return stock;
  }

  public async create(details: TFinancialCreateDetails, traderId: string) {
    const { type, amount, description, collateral, deadline } = details;
    const stock = await this.findStock(traderId);
    
    const newFinancial = await this.prismaService.mFinancial.create({
      data: {
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

    // Invalidate cache for this trader's financials list
    await this.cacheManager.del(`financials_${traderId}`);

    return newFinancial;
  }

  public async getFinancials(traderId: string) {
    const cacheKey = `financials_${traderId}`;
    
    // Try cache first
    let financials = await this.cacheManager.get(cacheKey);
    if (financials) {
      return financials;
    }

    const stock = await this.findStock(traderId);
    
    financials = await this.prismaService.mFinancial.findMany({
      where: { stockId: stock.id },
      orderBy: { createdAt: 'desc' }, // from the latest
      include: {
        stock: {
          include: { trader: true }
        },
        transaction: true
      }
    });
    
    // Cache for 10 minutes (financials list changes moderately)
    await this.cacheManager.set(cacheKey, financials, 600000);
    
    return financials;
  }

  public async getFinancial(financialId: string, traderId: string) {
    const cacheKey = `financial_${financialId}_${traderId}`;
    
    // Try cache first
    let financial = await this.cacheManager.get(cacheKey);
    if (financial) {
      return financial;
    }

    const stock = await this.findStock(traderId);

    financial = await this.prismaService.mFinancial.findFirst({
      where: { id: financialId, stockId: stock.id },      
      include: {
        stock: {
          include: { trader: true }
        },
        transaction: true
      }
    });
    if (!financial) throw new BadRequestException("Financial not found");
    
    // Cache for 30 minutes (individual financial records change less frequently)
    await this.cacheManager.set(cacheKey, financial, 1800000);
    
    return financial;
  }

  public async markAsPaidBack(financialId: string, traderId: string) {
    const stock = await this.findStock(traderId);

    const financial = await this.prismaService.mFinancial.update({
      where: { id: financialId, stockId: stock.id },
      data: { isPaidBack: true }
    });
  
    if (!financial) throw new BadRequestException("Financial not found");

    // Invalidate caches
    await this.cacheManager.del(`financials_${traderId}`);
    await this.cacheManager.del(`financial_${financialId}_${traderId}`);

    return financial;
  }

  public async updateFinancial(financialId: string, input: GqlFinancialUpdateInput, traderId: string) {
    const stock = await this.findStock(traderId);
    const { amount, deadline, description, collateral } = input;

    const updateData: any = {};
    if (input.amount !== undefined) updateData.amount = input.amount;
    if (input.deadline !== undefined) updateData.deadline = input.deadline;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.collateral !== undefined) updateData.collateral = input.collateral;

    const financial = await this.prismaService.mFinancial.update({
      where: { id: financialId, stockId: stock.id },
      data: updateData,
      include: {
        stock: { include: { trader: true } },
        transaction: true,
      }
    });
    if (!financial) throw new BadRequestException('Financial not found or not owned by trader');

    // Invalidate caches
    await this.cacheManager.del(`financials_${traderId}`);
    await this.cacheManager.del(`financial_${financialId}_${traderId}`);

    return financial;
  }
}
