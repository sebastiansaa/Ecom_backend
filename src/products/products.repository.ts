import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ProductWithCategory } from './interfaces';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput): Promise<ProductWithCategory> {
    return this.prisma.product.create({
      data,
      include: { category: true },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
  }): Promise<ProductWithCategory[]> {
    const { skip, take, where } = params;
    return this.prisma.product.findMany({
      skip,
      take,
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<ProductWithCategory | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async update(
    id: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<ProductWithCategory> {
    return this.prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async checkCategory(id: number): Promise<boolean> {
    const count = await this.prisma.category.count({ where: { id } });
    return count > 0;
  }
}
