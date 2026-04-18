import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TTransactionCreateDetails } from './transaction.types';
import { ENTransactionType, MProduct } from 'generated/prisma';
import { TFinancialCreateDetails } from '../financials/financials.types';
import { FinancialsService } from '../financials/financials.service';
import { GraphQLError } from 'graphql';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';
import { PaginationOptions, PaginationResult, PaginationHelper } from 'src/common/pagination';
import { SelectFieldsHelper } from 'src/common/select-fields';

@Injectable()
export class TransactionService {
    private readonly logger = new Logger(TransactionService.name);
    
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly financialService: FinancialsService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    public async getAllTransactions(traderId: string, type?: string, options?: PaginationOptions, fields?: string[]): Promise<PaginationResult<any>> {
        const { page = 1, limit = 10 } = options || {};
        const fieldsKey = fields ? fields.join(',') : 'all';
        const cacheKey = `transactions_${traderId}_${type || 'all'}_page_${page}_limit_${limit}_fields_${fieldsKey}`;
        
        // Try cache first
        let result = await this.cacheManager.get<PaginationResult<any>>(cacheKey);
        if (result) {
            this.logger.log(`🎯 CACHE HIT: Transactions for trader ${traderId} (${type || 'all'}) from cache`);
            return result;
        }

        this.logger.log(`🗄️  DB QUERY: Transactions for trader ${traderId} (${type || 'all'}) from database`);
        
        const { skip, take } = PaginationHelper.calculatePagination(page, limit);
        
        const stock = await this.prismaService.mStock.findUnique({
            where: { traderId }
        });
        if (!stock) throw new BadRequestException("Stock not found");

        let transactionType: ENTransactionType | undefined;
        if (type === "Sale") transactionType = ENTransactionType.Sale;
        else if (type === "Purchase") transactionType = ENTransactionType.Purchase;

        const whereClause = {
            stockId: stock.id,
            ...(transactionType ? { type: transactionType } : {})
        };

        // Build select query for field optimization
        const selectClause = SelectFieldsHelper.buildSelectQuery(fields) || {
            include: {
                stock: true,
                products: true,
                financials: true
            }
        };

        const [transactions, total] = await Promise.all([
            this.prismaService.mTransaction.findMany({
                where: whereClause,
                ...selectClause,
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take
            }),
            this.prismaService.mTransaction.count({
                where: whereClause
            })
        ]);

        result = PaginationHelper.createPaginationResult(transactions, total, page, limit);
        
        // Cache for 5 minutes (transactions change frequently)
        await this.cacheManager.set(cacheKey, result, 300000);
        this.logger.log(`💾 CACHE SET: Transactions for trader ${traderId} (${type || 'all'}) cached for 5 minutes`);

        return result;
    }

    public async getTransactionById(traderId: string, transactionId: string) {
        const cacheKey = `transaction_${transactionId}_${traderId}`;
        
        // Try cache first
        let transaction = await this.cacheManager.get(cacheKey);
        if (transaction) {
            this.logger.log(`🎯 CACHE HIT: Transaction ${transactionId} for trader ${traderId} from cache`);
            return transaction;
        }

        this.logger.log(`🗄️  DB QUERY: Transaction ${transactionId} for trader ${traderId} from database`);

        const stock = await this.prismaService.mStock.findUnique({
            where: { traderId }
        });
        if (!stock)
            throw new BadRequestException("Stock not found");

        transaction = await this.prismaService.mTransaction.findFirst({
            where: { id: transactionId, stockId: stock.id },
            include: {
                products: true,
                stock: { include: { trader: true } },
                financials: true,
            },
        });
        if (!transaction)
            throw new BadRequestException("Transaction not found");

        // Cache for 20 minutes (individual transactions change less frequently)
        await this.cacheManager.set(cacheKey, transaction, 1200000);
        this.logger.log(`💾 CACHE SET: Transaction ${transactionId} for trader ${traderId} cached for 20 minutes`);

        return transaction;
    }

    public async createTransaction(
        traderId: string,
        details: TTransactionCreateDetails,
        financialDetails?: TFinancialCreateDetails,
    ) {
        const { type, description, secondParty, products } = details;

        const stock = await this.prismaService.mStock.findFirst({
            where: { traderId },
        });
        if (!stock) throw new BadRequestException("Stock not found");

        const now = new Date();
        const stockImagesMap: Record<string, { id: string; quantity: number }> = {};
        const missingProducts: string[] = [];
        const quantityErrors: string[] = [];

        for (const product of products) {
            if (!stockImagesMap[product.name]) {
                const stockImg = await this.prismaService.mStockImage.findUnique({
                    where: { name_stockId: { name: product.name, stockId: stock.id } },
                    select: { id: true, quantity: true },
                });
                if (!stockImg) {
                    missingProducts.push(product.name);
                } else {
                    stockImagesMap[product.name] = { id: stockImg.id, quantity: stockImg.quantity };
                }
            }
        }

        if (missingProducts.length > 0) {
            quantityErrors.push(
                `The following products are missing stock images: ${missingProducts.join(", ")}`
            );
        }

        const combinedProducts: Record<string, { quantity: number; price: number }> = {};
        for (const product of products) {
            if (!combinedProducts[product.name]) {
                combinedProducts[product.name] = { quantity: product.quantity, price: product.price };
            } else {
                combinedProducts[product.name].quantity += product.quantity;
            }
        }

        for (const [name, { quantity }] of Object.entries(combinedProducts)) {
            const stockImg = stockImagesMap[name];
            if (type === "Sale" && stockImg.quantity < quantity) {
                quantityErrors.push(
                    `Not enough stock for ${name}. Available: ${stockImg.quantity}, requested: ${quantity}`
                );
            }
        }

        // if (quantityErrors.length > 0) {
        //     throw new BadRequestException({ error: quantityErrors});
        // }

        if (quantityErrors.length > 0) {
            throw new GraphQLError(
                JSON.stringify(quantityErrors),
                {
                    extensions: {
                        code: 'BAD_REQUEST'
                    }
                }
            );
        }

        return await this.prismaService.$transaction(async prisma => {
            for (const [name, { quantity }] of Object.entries(combinedProducts)) {
                const stockImg = stockImagesMap[name];
                await prisma.mStockImage.update({
                    where: { id: stockImg.id },
                    data:
                        type === "Purchase"
                            ? { quantity: { increment: quantity } }
                            : { quantity: { decrement: quantity } },
                });
            }

            const validatedProducts = products.map(p => ({
                name: p.name,
                price: p.price,
                stockImageId: stockImagesMap[p.name].id,
                quantity: p.quantity,
                createdAt: now,
                updatedAt: now,
            }));

            const transaction = await prisma.mTransaction.create({
                data: {
                    type,
                    description,
                    secondParty,
                    stockId: stock.id,
                    products: { create: validatedProducts },
                    financials: financialDetails
                        ? {
                            create: {
                                type: financialDetails.type,
                                amount: financialDetails.amount,
                                description: financialDetails.description,
                                collateral: financialDetails.collateral,
                                deadline: financialDetails.deadline ?? undefined,
                                stockId: stock.id,
                            },
                        }
                        : undefined,
                },
                include: {
                    products: { orderBy: { createdAt: "desc" } },
                    stock: { include: { trader: true } },
                    financials: true,
                },
            });

            return transaction;
        });

        // Invalidate caches for this trader's transactions
        await this.cacheManager.del(`transactions_${traderId}_all`);
        await this.cacheManager.del(`transactions_${traderId}_Sale`);
        await this.cacheManager.del(`transactions_${traderId}_Purchase`);
        this.logger.log(`🗑️  CACHE INVALIDATE: Transaction caches for trader ${traderId}`);
        
        // Also invalidate stock and analysis caches since transactions affect them
        await this.cacheManager.del(`stock_${traderId}`);
        await this.cacheManager.del(`stock_images_${traderId}`);
        this.logger.log(`🗑️  CACHE INVALIDATE: Stock and analysis caches for trader ${traderId}`);
        
        // Return the created transaction (need to fetch it again since we're outside the transaction)
        const createdTransaction = await this.getTransactionById(traderId, (await this.prismaService.mTransaction.findFirst({
            where: { stockId: (await this.prismaService.mStock.findUnique({ where: { traderId } }))!.id },
            orderBy: { createdAt: 'desc' }
        }))!.id);
        
        return createdTransaction;
    }

}
