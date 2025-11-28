import type { Product as PrismaProduct, Category as PrismaCategory } from '@prisma/client';

export type ProductWithCategory = PrismaProduct & { category: PrismaCategory };

export type FindAllParams = {
  take?: number; // limte de resultados
  skip?: number;// offset para paginación (deffault 0)
  q?: string;// busqueda por título o descripción (case-insensitive)
};