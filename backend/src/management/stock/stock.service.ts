<<<<<<< HEAD
import { BadRequestException, Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { EUnitType } from 'generated/prisma';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as pluralize from 'pluralize';

@Injectable()
export class StockService {
    public constructor(
        private readonly prismaService: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    /**
     * Normalizes stock image names by:
     * 1. Converting to singular form
     * 2. Converting to lowercase
     * 3. Trimming whitespace
     * 4. Replacing multiple spaces with single space
     * 5. Removing special characters (except letters, numbers, and spaces)
     */
    private normalizeStockName(name: string): string {
        try {
            let normalizedName = pluralize.singular(name.toLowerCase());
            normalizedName = normalizedName.trim().replace(/\s+/g, ' ');
            normalizedName = normalizedName.replace(/[^a-z0-9\s]/g, '');
            return normalizedName;
        } catch (error) {
            // Fallback normalization if pluralize fails
            let fallbackName = name.toLowerCase().replace(/s$/, '');
            fallbackName = fallbackName.trim().replace(/\s+/g, ' ');
            fallbackName = fallbackName.replace(/[^a-z0-9\s]/g, '');
            return fallbackName;
        }
    }

    public async getStockImages(traderId: string) {
        const cacheKey = `stock_images_${traderId}`;
        
        // Try cache first
        let images = await this.cacheManager.get(cacheKey);
        if (images) {
            return images;
        }

        images = await this.prismaService.mStockImage.findMany({
            where: { 
                stock: {
                    traderId
                }
            },
            include: { 
                stock: {
                    include: {
                        trader: true
                    }
                }
            }
        }) ?? [];
        
        // Cache for 20 minutes (stock images change moderately)
        await this.cacheManager.set(cacheKey, images, 1200000);
        
        return images;
    }

    public async getStockImage(traderId: string, stockImgId: string) {
        const cacheKey = `stock_image_${stockImgId}_${traderId}`;
        
        // Try cache first
        let image = await this.cacheManager.get(cacheKey);
        if (image) {
            return image;
        }

        image = await this.prismaService.mStockImage.findUnique({ 
            where: { 
                id: stockImgId, 
                stock: { traderId } 
            },
            include: {
                stock: {
                    include: {
                        trader: true
                    }
                }
            } 
        });
        
        // Cache for 30 minutes (individual stock images change less frequently)
        await this.cacheManager.set(cacheKey, image, 1800000);
        
        return image;
    }

    public async createStockImage(
        details: { name: string, unit: EUnitType, low_stock_quantity?: number }, 
        traderId: string
    ) {
        try {
            const { name, unit, low_stock_quantity } = details;
            const nameLower = this.normalizeStockName(name);

            const stock = await this.prismaService.mStock.findUnique({
                where: { traderId }
            });
            if (!stock) throw new BadRequestException('Stock not found');

            const existing = await this.prismaService.mStockImage.findUnique({
                where: {
                    name_stockId: { name: nameLower, stockId: stock.id }
                }
            });
            if (existing) throw new BadRequestException('Stock product already exists for this stock');

            const stockImage = await this.prismaService.mStockImage.create({
                data: {
                    stockId: stock.id,
                    name: nameLower,
                    unit: unit,
                    low_stock_quantity, // by default will be 5
                },
                include: {
                    stock: { include: { trader: true } }
                }
            });

            // Invalidate cache for this trader's stock images
            await this.cacheManager.del(`stock_images_${traderId}`);

            return stockImage;
        } catch (error) {
            throw error;
        }
    }

    public async createMultipleStockImages(
        details: { name: string; unit: EUnitType, low_stock_quantity?: number }[],
        traderId: string
    ) {
        const stock = await this.prismaService.mStock.findUnique({
            where: { traderId },
        });
        if (!stock) throw new BadRequestException('Stock not found');

        try {
            const stockImages = await this.prismaService.$transaction(
                details.map((detail) => {
                    const nameLower = this.normalizeStockName(detail.name);
                    return this.prismaService.mStockImage.create({
                        data: {
                            name: nameLower,
                            unit: detail.unit,
                            stockId: stock.id,
                        },
                        include: {
                            stock: { include: { trader: true } },
                        },
                    });
                })
            );

            return stockImages;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new BadRequestException('One or more stock images already exist');
            }
            throw error;
        } finally {
            // Invalidate cache for this trader's stock images
            await this.cacheManager.del(`stock_images_${traderId}`);
        }
    }

    public async updateStockImage(
        details: { name?: string, unit?: EUnitType, low_stock_quantity?: number }, 
        traderId: string, imgId: string
    ) {
        try {
            const stockImage = await this.prismaService.mStockImage.update({
                where: {
                    id: imgId,
                    stock: { traderId }
                },
                data: {
                    name: details.name ? this.normalizeStockName(details.name) : undefined,
                    unit: details.unit,
                    low_stock_quantity: details.low_stock_quantity,
                },
                include: {
                    stock: {
                        include: {
                            trader: true
                        }
                    }
                }
            });

            // Invalidate caches
            await this.cacheManager.del(`stock_images_${traderId}`);
            await this.cacheManager.del(`stock_image_${imgId}_${traderId}`);

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
                },
                include: {
                    stock: {
                        include: {
                            trader: true
                        }
                    }
                }
            });

            // Invalidate caches
            await this.cacheManager.del(`stock_images_${traderId}`);
            await this.cacheManager.del(`stock_image_${imgId}_${traderId}`);

            return stockImage;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) 
                if (error.code === 'P2025') 
                    throw new BadRequestException('Product not found');
        }
    }

    public async getStock(traderId: string) {
        const cacheKey = `stock_${traderId}`;
        
        // Try cache first
        let stock = await this.cacheManager.get(cacheKey);
        if (stock) {
            return stock;
        }

        stock = await this.prismaService.mStock.findMany({
            where: { traderId },
            include: { 
                trader: true,
                images: true
            }
        });
        
        // Cache for 25 minutes (stock data changes moderately)
        await this.cacheManager.set(cacheKey, stock, 1500000);
        
        return stock;
    }
}
=======
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
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
