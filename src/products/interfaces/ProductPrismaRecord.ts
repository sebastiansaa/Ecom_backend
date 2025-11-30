import type { CategoryRecord } from '../../categories/interface';
// Define la estructura de datos de un producto tal como se recibe de la base de datos Prisma.
// `price` puede venir como string o number (o Decimal en tiempo de ejecución). Usamos `string|number` para
// evitar dependencias a runtime en tipos de Prisma en este archivo de interfaces ligeras.

export type ProductPrismaRecord = {
  id: number;
  title: string;
  slug: string;
  // En el dominio tratamos `price` como number
  price: number | string | { toNumber(): number };
  description: string;
  images: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
  category: CategoryRecord;
};
