import type { ProductEntity } from '../../products/entities/product.entity';
import { CategoryResponseDto } from '../dto/response-category.dto';

export class CategoryEntity {
    id: number;
    name: string;
    slug: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    products?: ProductEntity[];

    constructor(c: any) {
        this.id = c.id;
        this.name = c.name;
        this.slug = c.slug;
        this.image = c.image ?? '';
        this.createdAt = c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt);
        this.updatedAt = c.updatedAt instanceof Date ? c.updatedAt : new Date(c.updatedAt);
        this.products = (c as any).products;
    }

    toDTO(): CategoryResponseDto {
        return {
            id: this.id,
            name: this.name,
            slug: this.slug,
            image: this.image,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }
}
