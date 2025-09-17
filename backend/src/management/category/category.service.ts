import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { TCreateCategoryDetails, TUpdateCategoryDetails } from './category.types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CategoryService {
    public constructor(
        private readonly prismaService: PrismaService
    ) {}

    public findAll(){
        return this.prismaService.mCategory.findMany();
    }

    public findOne(id: string){
        return this.prismaService.mCategory.findUnique({ where: { id } });
    }

    public async create(details: TCreateCategoryDetails){
        try {
            const newCategory = await this.prismaService.mCategory.create({ data: { 
                name: details.name,
                description: details.description,
            } });
            return newCategory;
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002')
                    throw new BadRequestException('Category already exists');
            }
            throw new InternalServerErrorException(error.message || "Something went wrong.");
        }
    }

    public async update(id: string, details: TUpdateCategoryDetails){
        try {
            const updatedCategory = await this.prismaService.mCategory.update({ 
                where: { id }, 
                data: { 
                    name: details.name,
                    description: details.description,
                } 
            });

            return updatedCategory;
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === "P2005")
                    throw new BadRequestException('Category not found');
            }
            throw new InternalServerErrorException(error.message || "Something went wrong.");
        }
    }

    public async delete(id: string){
        try {
            const products = await this.prismaService.mProduct.findMany({ where: { categoryId: id } });
            if(products.length > 0)
                throw new BadRequestException('Category has products');

            const deletedCategory = await this.prismaService.mCategory.delete({ where: { id } });
            return deletedCategory;
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === "P2005")
                    throw new BadRequestException('Category not found');
            }
            throw new InternalServerErrorException(error.message || "Something went wrong.");
        }
    }
}