// Entity USANDO PRISMA: Clase de dominio que refleja la estructura de datos del producto,
// recibe un objeto plano de Prisma, inicializa y valida sus propiedades, convierte relaciones
// en entidades tipadas y ofrece un método toDTO() para entregar una salida consistente al frontend.

import { CategoryEntity } from '../../categories/entities/category.entity';
import { ResponseProductDto } from '../dto/response-product.dto';
import type { ProductPrismaRecord } from '../interfaces/ProductPrismaRecord';
import { formatEntityDate, toDate } from '../../shared/helpers';

export class ProductEntity {
  id: number;
  title: string;
  slug: string;
  // Exponemos price como number en la API. Normalizamos aquí desde string/Decimal/number.
  price: number;
  description: string;
  images: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
  category: CategoryEntity;

  constructor(p: ProductPrismaRecord) {
    this.id = p.id;
    this.title = p.title ?? '';
    this.slug = p.slug ?? '';
    // Normalizar price: puede venir como number, string, o Decimal-like.
    if (p.price == null) {
      this.price = 0;
    } else if (typeof p.price === 'number') {
      this.price = p.price;
    } else if (typeof p.price === 'string') {
      this.price = parseFloat(p.price) || 0;
    } else if (typeof p.price === 'object' && 'toNumber' in p.price) {
      // Decimal-like (Prisma Decimal) tiene toNumber()
      this.price = p.price.toNumber();
    } else {
      this.price = Number(p.price) || 0;
    }
    this.description = p.description ?? '';
    this.images = Array.isArray(p.images) ? p.images : [];
    this.createdAt = toDate(p.createdAt);
    this.updatedAt = toDate(p.updatedAt);
    const catRaw = p.category;
    if (!catRaw) {
      throw new Error('Invariant: product must have a category');
    }
    this.category = new CategoryEntity(catRaw);
  }

  toDTO(): ResponseProductDto {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      price: this.price,
      description: this.description,
      category: this.category.toDTO(),
      images: this.images,
      createdAt: formatEntityDate(this.createdAt) ?? '',
      updatedAt: formatEntityDate(this.updatedAt) ?? '',
    };
  }
}
