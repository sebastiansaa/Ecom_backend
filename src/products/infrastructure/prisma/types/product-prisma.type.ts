import { Prisma } from '@prisma/client';

/**
 * Tipo de Infraestructura (Prisma).
 * Define la estructura EXACTA que devuelve Prisma al consultar un producto.
 * Incluye las relaciones obligatorias (como category) gracias al 'include'.
 * Se usa en los Mappers para asegurar el tipado estricto desde la DB.
 */
export const productInclude = {
  category: true,
} satisfies Prisma.ProductInclude;

export type ProductPrismaRecord = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;
