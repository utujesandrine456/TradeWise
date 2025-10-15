import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TTransactionCreateDetails } from './transaction.types';
import { ENTransactionType, MProduct } from 'generated/prisma';
import { generateUlid } from 'id-tools';
import { TFinancialCreateDetails } from '../financials/financials.types';
import { FinancialsService } from '../financials/financials.service';

@Injectable()
export class TransactionService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly financialService: FinancialsService,
    ) {}

    public async getAllTransactions(traderId: string, type?: string) {
        const stock = await this.prismaService.mStock.findUnique({
            where: { traderId }
        });
        if (!stock) throw new BadRequestException("Stock not found");

        let transactionType: ENTransactionType | undefined;
        if (type === "Sale") transactionType = ENTransactionType.Sale;
        else if (type === "Purchase") transactionType = ENTransactionType.Purchase;

        console.log("Transaction Type: ", transactionType);
        const transactions = await this.prismaService.mTransaction.findMany({
            where: { 
                stockId: stock.id,
                ...(transactionType ? { type: transactionType } : {})
            },
            orderBy: { createdAt: 'desc' },
            include: { 
                products: true,
                stock: { include: { trader: true } },
                financials: true,
            },
        });

        return transactions;
    }

    public async getTransactionById(traderId: string, transactionId: string) {
        const stock = await this.prismaService.mStock.findUnique({
            where: { traderId }
        });
        if (!stock) 
            throw new BadRequestException("Stock not found");

        const transaction = await this.prismaService.mTransaction.findFirst({
            where: { id: transactionId, stockId: stock.id },
            include: { 
                products: true,
                stock: { include: { trader: true } },
                financials: true,
            },
        });
        if (!transaction) 
            throw new BadRequestException("Transaction not found");

        return transaction;
    }

    public async createTransaction(
        traderId: string, 
        details: TTransactionCreateDetails, 
        financialDetails?: TFinancialCreateDetails
    ) {
        const { type, description, secondParty, products } = details;


        const stock = await this.prismaService.mStock.findFirst({
            where: { traderId }
        });
        if (!stock) throw new BadRequestException("Stock not found");

        const now = new Date();

        
        const validatedProducts: MProduct[] = [];
        const imageQuantityDeltas: Array<{ imageId: string; delta: number }> = [];

        for (const product of products) {
            const nameLower = (product.name || '').toLowerCase().trim();
            const displayName = (product.name || '').trim();

            const image = await this.prismaService.mStockImage.upsert({
                where: { name_stockId: { name: nameLower, stockId: stock.id } },
                update: {},
                create: { name: nameLower, stockId: stock.id }, 
            });

            validatedProducts.push({
                id: generateUlid(),
                name: displayName,
                stockImageId: image.id,
                quantity: product.quantity,
                price: product.price,
                brand: product.brand ?? null,
                createdAt: now,
                updatedAt: now,
            });

            const delta = type === 'Purchase' ? product.quantity : -product.quantity;
            imageQuantityDeltas.push({ imageId: image.id, delta });
        }

        // Persist everything atomically
        const [transaction] = await this.prismaService.$transaction([
            this.prismaService.mTransaction.create({
                data: {
                    id: generateUlid(),
                    type,
                    description,
                    secondParty,
                    stockId: stock.id,
                    products: {
                        create: validatedProducts.map(({ id, name, stockImageId, quantity, price, brand, createdAt, updatedAt }) => ({
                            id, name, price, brand,
                            stockImageId, quantity,
                            createdAt, updatedAt,
                        })),
                    },
                    financials: financialDetails 
                        ? {
                            create: {
                                id: generateUlid(),
                                type: financialDetails.type,
                                amount: financialDetails.amount,
                                description: financialDetails.description,
                                collateral: financialDetails.collateral,
                                deadline: financialDetails.deadline ?? undefined,
                                stockId: stock.id,
                            }
                        } 
                    : undefined,
                },
                include: {
                    products: { orderBy: { createdAt: 'desc' } },
                    stock: { include: { trader: true } },
                    financials: true,
                },
            }),
            // Apply quantity updates for each stock image
            ...imageQuantityDeltas.map(({ imageId, delta }) =>
                this.prismaService.mStockImage.update({
                    where: { id: imageId },
                    data: { quantity: { increment: delta } },
                })
            ),
        ]);

        return transaction;
    }
}
