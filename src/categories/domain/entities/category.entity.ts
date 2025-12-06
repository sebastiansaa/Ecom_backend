import { ProductEntity } from '../../../products/domain/entities/product.entity';
import { CategoryProps } from '../interfaces';
import { formatEntityDate, toDate } from '../../../shared/helpers';

export class CategoryEntity {
  id: number;
  name: string;
  slug: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  products: ProductEntity[];

  constructor(p: CategoryProps) {
    //validaciones
    if (!p.name) throw new Error('Invariant: category: name es obligatorio');
    if (!p.id) throw new Error('Invariant: category: id es obligatorio');
    if (!p.slug) throw new Error('Invariant: category: slug es obligatorio');

    this.id = p.id;
    this.name = p.name ?? '';
    this.slug = p.slug ?? '';
    this.createdAt = toDate(p.createdAt);
    this.updatedAt = toDate(p.updatedAt);

    // Normaliza los productos asociados
    this.products = Array.isArray(p.products)
      ? p.products.map((prod) => new ProductEntity(prod))
      : []; // Asegura que siempre sea un array
  }

  // verifica si la categoría tiene productos asociados
  hasProducts(): boolean {
    return this.products.length > 0;
  }

  // agrega un producto a la categoría
  addProduct(product: ProductEntity): void {
    this.products.push(product);
  }

  toDTO() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      createdAt: formatEntityDate(this.createdAt) ?? '',
      updatedAt: formatEntityDate(this.updatedAt) ?? '',
      products: this.products.map((product) => product.toDTO()), // Entrega productos como DTOs
    };
  }
}
