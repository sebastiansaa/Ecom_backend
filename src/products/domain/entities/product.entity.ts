// Entity USANDO PRISMA: Clase de dominio que refleja la estructura de datos del producto,
// recibe un objeto plano de Prisma, inicializa y valida sus propiedades, convierte relaciones
// en entidades tipadas y ofrece un método toDTO() para entregar una salida consistente al front. normaliza los datos.

import { CategoryEntity } from '../../../categories/domain/entities/category.entity';
import { ResponseProductDto } from '../dto/response-product.dto';
import { ProductProps } from '../interfaces/product-props.interface';
import { formatEntityDate, toDate } from '../../../shared/helpers';

export class ProductEntity {
  // 1. Propiedades
  id: number;
  title: string;
  slug: string;
  stock: number;
  active: boolean;
  price: number;
  description: string;
  images: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
  category: CategoryEntity;

  // 2. Constructor
  constructor(p: ProductProps) {
    this.id = p.id;
    this.title = p.title ?? '';
    this.slug = p.slug ?? '';
    if (p.price == null) {
      this.price = 0;
    } else if (typeof p.price === 'number') {
      this.price = p.price;
    } else if (typeof p.price === 'string') {
      this.price = parseFloat(p.price) || 0;
    } else {
      this.price = (p.price as any).toNumber();
    }
    this.description = p.description ?? '';
    this.images = Array.isArray(p.images) ? p.images : [];
    this.stock = typeof p.stock === 'number' ? p.stock : 0;
    this.active = typeof p.active === 'boolean' ? p.active : true;
    this.createdAt = toDate(p.createdAt);
    this.updatedAt = toDate(p.updatedAt);
    const catRaw = p.category;
    if (!catRaw) {
      throw new Error('Invariant: product must have a category');
    }
    this.category = new CategoryEntity(catRaw);
  }

  // 3. Métodos de negocio principales
  update(data: {
    title?: string;
    slug?: string;
    price?: number | string;
    description?: string;
    images?: string[];
    stock?: number;
    active?: boolean;
    updatedAt?: Date | string | null;
    category?: CategoryEntity;
  }): void {
    if (data.title !== undefined) this.updateProductTitle(data.title);
    if (data.slug !== undefined) this.updateSlug(data.slug);
    if (data.price !== undefined) {
      if (typeof data.price === 'number') {
        this.updatePrice(data.price);
      } else if (typeof data.price === 'string') {
        const parsed = parseFloat(data.price);
        this.updatePrice(parsed);
      }
    }
    if (data.description !== undefined) this.updateDescription(data.description);
    if (data.images !== undefined) this.images = Array.isArray(data.images) ? data.images : [];
    if (data.stock !== undefined) this.stock = data.stock;
    if (data.active !== undefined) this.active = data.active;
    if (data.updatedAt !== undefined) this.updatedAt = toDate(data.updatedAt);
    if (data.category !== undefined) {
      this.updateCategory(data.category);
    }
  }

  remove(): void {
    if (this.stock > 0) {
      throw new Error(' No se puede eliminar un producto con stock disponible');
    }
  }

  updateProductTitle(newTitle: string): void {
    if (!newTitle || typeof newTitle !== 'string') {
      throw new Error('Nombre inválido');
    }
    this.title = newTitle;
  }

  updateStock(quantity: number): void {
    if (quantity <= 0) throw new Error('Cantidad inválida');
    this.stock += quantity;
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) throw new Error('Cantidad inválida');
    if (this.stock < quantity) throw new Error('Stock insuficiente');
    this.stock -= quantity;
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) throw new Error('Cantidad inválida');

    this.stock += quantity;
  }

  hasSufficientStock(quantity: number): boolean {
    return this.stock >= quantity;
  }

  markAsInactive(): void {
    this.active = false;
  }

  markAsActive(): void {
    this.active = true;
  }

  addImage(url: string): void {
    if (!url || typeof url !== 'string') throw new Error('URL de imagen inválida');
    this.images.push(url);
  }

  removeImage(url: string): void {
    this.images = this.images.filter((img) => img !== url);
  }

  updateDescription(newDescription: string): void {
    this.description = newDescription ?? '';
  }

  updatePrice(newPrice: number): void {
    if (typeof newPrice !== 'number' || isNaN(newPrice) || newPrice < 0) {
      throw new Error('Precio inválido');
    }
    this.price = newPrice;
  }

  updateSlug(newSlug: string): void {
    if (!newSlug || typeof newSlug !== 'string') {
      throw new Error('Slug inválido');
    }
    // Validar formato slug: solo minúsculas, números y guiones
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(newSlug)) {
      throw new Error('El slug debe ser minúsculas, sin espacios, solo letras, números y guiones');
    }
    this.slug = newSlug;
  }

  updateCategory(newCategory: CategoryEntity): void {
    if (!(newCategory instanceof CategoryEntity)) {
      throw new Error('La categoría debe ser una instancia válida');
    }
    this.category = newCategory;
  }

  // 4. Métodos de validación/utilitarios
  canBePurchased(): boolean {
    return this.stock > 0 && this.active;
  }

  isActive(): boolean {
    return this.active;
  }

  // 5. Conversión a DTO
  toDTO(): ResponseProductDto {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      price: this.price,
      description: this.description,
      category: this.category.toDTO(),
      images: this.images,
      stock: this.stock,
      active: this.active,
      createdAt: formatEntityDate(this.createdAt) ?? '',
      updatedAt: formatEntityDate(this.updatedAt) ?? '',
    };
  }
}
