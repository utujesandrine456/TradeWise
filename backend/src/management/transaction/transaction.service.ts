import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TTransactionCreateDetails } from './transaction.types';
import { ENTransactionType, MProduct } from 'generated/prisma';
import { generateUlid } from 'id-tools';

@Injectable()
export class TransactionService {
    public constructor(
        private readonly prismaService: PrismaService
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

    public async createTransaction(traderId: string, details: TTransactionCreateDetails) {
        const {type, description, secondParty, products} = details;
        const stock = await this.prismaService.mStock.findFirst({
            where: { traderId }
        });
        if (!stock) throw new BadRequestException("Stock not found");

        const now = new Date();

        //verify if all products have stockImages and create the products
        const missingProducts: string[] = [];
        const validatedProducts: MProduct[] = [];

        for (const product of products) {
            const stockImg = await this.prismaService.mStockImage.findUnique({
                where: {
                name_stockId: { name: product.name, stockId: stock.id },
                },
            });

            if (!stockImg) {
                missingProducts.push(product.name);
            } else {
                validatedProducts.push({
                id: generateUlid(),
                name: product.name,
                stockImageId: stockImg.id,
                quantity: product.quantity,
                price: product.price,
                brand: product.brand ?? null,
                createdAt: now,
                updatedAt: now,
                });
            }
        }

        if (missingProducts.length > 0) {
            throw new BadRequestException(
                `The following products are missing stock images: ${missingProducts.join(
                ", "
                )}. Please add them first.`
            );
        }

        const transaction = await this.prismaService.mTransaction.create({
            data: {
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
            },
            include: {
                products: true,
                stock: { include: { trader: true } },
            },
        });

        return transaction;
    }
}
