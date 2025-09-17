import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { GqlMCategory } from './category.gqlmodel';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { isValidUlid } from 'id-tools'; // my own
import { BadRequestException } from '@nestjs/common';

@Resolver()
export class CategoryResolver {
    public constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @Query(() => [GqlMCategory])
    public async categories() {
        return this.categoryService.findAll();
    }

    @Query(() => GqlMCategory)
    public async category(@Args('id') id: string) {
        if(!isValidUlid(id))
            throw new BadRequestException('Invalid or empty id');
        
        return this.categoryService.findOne(id);
    }

    @Mutation(() => GqlMCategory)
    public async addCategory(
        @Args('data') data: CreateCategoryDto
    ) {
        return this.categoryService.create(data);
    }

    @Mutation(() => GqlMCategory)
    public async updateCategory(
        @Args('data') data: UpdateCategoryDto,
        @Args('id') id: string
    ) {
        if(!isValidUlid(id))
            throw new BadRequestException('Invalid or empty id');
        
        return this.categoryService.update(id, data);
    }

    @Mutation(() => GqlMCategory)
    public async deleteCategory(
        @Args('id') id: string
    ) {
        if(!isValidUlid(id))
            throw new BadRequestException('Invalid or empty id');
        
        return this.categoryService.delete(id);
    }
}