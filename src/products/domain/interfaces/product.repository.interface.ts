import { ProductEntity } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FindAllParams } from './find-params';

/**
 * Contrato del Repositorio de Productos (Dominio).
 * Define QUÉ operaciones de persistencia necesitamos, sin importar CÓMO se implementen (Prisma, TypeORM, Memoria).
 * El dominio depende de esta interfaz, no de la implementación concreta.
 */
export interface ProductRepository {
  create(data: CreateProductDto): Promise<ProductEntity>;
  findAll(params: FindAllParams): Promise<ProductEntity[]>;
  findOne(id: number): Promise<ProductEntity | null>;
  update(id: number, data: UpdateProductDto): Promise<ProductEntity>;
  remove(id: number): Promise<void>;
  findByTitle(title: string): Promise<ProductEntity | null>;
}

// Token para inyección de dependencias
export const PRODUCT_REPOSITORY_TOKEN = 'ProductRepository';
