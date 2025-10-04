import { BadRequestException, Injectable } from '@nestjs/common';
import { ENTransactionType, MProduct } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalysisService {
    public constructor(
        private readonly prismaService: PrismaService
    ) {}

    public async analyse(traderId: string, details: { start?: Date; end?: Date }) {
        let { start, end } = details;

        const traderSettings = await this.prismaService.mTraderSettings.findUnique({ where: { traderId } });
        const evalPeriod = traderSettings?.evaluationPeriod || 7; // default 7 days

        // Compute start and end safely
        const computedStart = start
            ? start
            : end
            ? new Date(end.getTime() - evalPeriod * 24 * 60 * 60 * 1000)
            : new Date(Date.now() - evalPeriod * 24 * 60 * 60 * 1000);

        const computedEnd = end
            ? end
            : start
            ? new Date(start.getTime() + evalPeriod * 24 * 60 * 60 * 1000)
            : new Date();

        // Standardize: start <= end
        const analysisStart = computedStart < computedEnd ? computedStart : computedEnd;
        const analysisEnd = computedStart < computedEnd ? computedEnd : computedStart;

        // Fetch stock
        const stock = await this.prismaService.mStock.findUnique({
            where: { traderId },
            include: {
                trader: true,
                images: true,
            },
        });
        if (!stock) throw new BadRequestException('Stock not found');

        // Fetch transactions within period
        const transactions = await this.prismaService.mTransaction.findMany({
            where: {
                stockId: stock.id,
                createdAt: { gte: analysisStart, lte: analysisEnd }, // use computed dates
            },
            include: {
                products: true,
                financials: true,
            },
        });

        // Map products
        const products: Record<string, MProduct[]> = { bought: [], sold: [] };
        for (const transaction of transactions) {
            if (transaction.type === ENTransactionType.Purchase) {
                products.bought.push(...transaction.products);
            } else if (transaction.type === ENTransactionType.Sale) {
                products.sold.push(...transaction.products);
            }
        }

        // Calculate totals
        const totalSales = products.sold.reduce((sum, p) => sum + p.price * p.quantity, 0);
        const totalPurchases = products.bought.reduce((sum, p) => sum + p.price * p.quantity, 0);
        const profit = totalSales - totalPurchases;

        // Calculate finance
        const credits = transactions
            .filter((t) => t.financials?.some((f) => f.type === 'Credit'))
            .reduce((sum, t) => sum + t.financials!.reduce((s, f) => s + (f.amount || 0), 0), 0);

        const debits = transactions
            .filter((t) => t.financials?.some((f) => f.type === 'Debit'))
            .reduce((sum, t) => sum + t.financials!.reduce((s, f) => s + (f.amount || 0), 0), 0);

        // Return analysis matching MGqlStockAnalysis
        return {
            analysisPeriod: { startDate: analysisStart, endDate: analysisEnd },
            stock,
            products,
            transactions,
            totalSales,
            totalPurchases,
            profit,
            finance: { credits, debits },
        };
    }
}
