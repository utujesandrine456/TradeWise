import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

@InputType()
export class CreateCategoryDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;
}

@InputType()
export class UpdateCategoryDto {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string;
    
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;
}