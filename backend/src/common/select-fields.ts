import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SelectFieldsInput {
  @Field(() => [String], { nullable: true })
  fields?: string[];
}

export interface SelectFieldsOptions {
  select?: Record<string, any>;
}

export class SelectFieldsHelper {
  static buildSelectQuery(fields?: string[]): Record<string, any> | undefined {
    if (!fields || fields.length === 0) {
      return undefined;
    }

    const select: Record<string, any> = {};
    
    for (const field of fields) {
      // Handle nested fields like "stock.name" or "products.price"
      const parts = field.split('.');
      
      if (parts.length === 1) {
        // Simple field
        select[field] = true;
      } else if (parts.length === 2) {
        // Nested field like "stock.name"
        const [relation, nestedField] = parts;
        
        if (!select[relation]) {
          select[relation] = { select: {} };
        }
        
        select[relation].select[nestedField] = true;
      }
    }

    return select;
  }

  static getDefaultFields(modelName: string): string[] {
    const defaults: Record<string, string[]> = {
      transaction: ['id', 'type', 'description', 'createdAt'],
      stock: ['id', 'name', 'quantity'],
      product: ['id', 'name', 'price', 'quantity'],
      financial: ['id', 'type', 'amount', 'isPaidBack'],
      notification: ['id', 'title', 'message', 'read', 'createdAt'],
      trader: ['id', 'name', 'email'],
    };

    return defaults[modelName.toLowerCase()] || ['id', 'createdAt'];
  }
}
