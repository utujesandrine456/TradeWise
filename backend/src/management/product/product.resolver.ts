import { Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}
}
