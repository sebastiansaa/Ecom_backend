import { CategoryEntity } from '../../../categories/domain/entities/category.entity';

/**
 * Interfaz flexible para las propiedades del Producto.
 * Actúa como un adaptador (DTO interno) para el constructor de la Entidad.
 * Permite recibir datos crudos de Prisma (Decimal, fechas como string, relaciones sin tipar)
 * y que la Entidad se encargue de normalizarlos y validarlos.
 */
export interface ProductProps {
  id: number;
  title: string;
  slug: string;
  price: any; // Puede ser Decimal (Prisma), number o string. La entidad lo normaliza.
  description: string;
  images: string[];
  stock: number;
  active: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  category: any; // Recibimos el objeto crudo de la relación y la entidad lo instancia.
}
