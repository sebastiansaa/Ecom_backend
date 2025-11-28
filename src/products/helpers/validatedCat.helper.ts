// Verifica si una categoría existe en la base de datos utilizando Prisma.
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

export async function validateCategoryExists(
    prisma: PrismaService,
    categoryId: number,
): Promise<void> {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
        throw new BadRequestException('La categoría especificada no existe');
    }
}