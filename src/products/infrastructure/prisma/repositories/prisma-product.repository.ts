import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ProductEntity } from '../../../domain/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { productInclude } from '../types/product-prisma.type';
import { CreateProductDto, ProductSort, UpdateProductDto } from '../../../domain/dto';
import { FindAllParams, ProductRepository } from '../../../domain/interfaces';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const data = ProductMapper.toPersistence(dto);
    const record = await this.prisma.product.create({
      data,
      include: productInclude,
    });
    return ProductMapper.toEntity(record);
  }

  async findAll(params: FindAllParams): Promise<ProductEntity[]> {
    const { skip, take, q, minPrice, maxPrice, categoryId, sort } = params;

    const where: Prisma.ProductWhereInput = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    if (sort) {
      switch (sort) {
        case ProductSort.PRICE_ASC:
          orderBy = { price: 'asc' };
          break;
        case ProductSort.PRICE_DESC:
          orderBy = { price: 'desc' };
          break;
        case ProductSort.NEWEST:
          orderBy = { createdAt: 'desc' };
          break;
        case ProductSort.OLDEST:
          orderBy = { createdAt: 'asc' };
          break;
      }
    }

    const records = await this.prisma.product.findMany({
      skip,
      take,
      where,
      include: productInclude,
      orderBy,
    });
    return records.map((record) => ProductMapper.toEntity(record));
  }

  async findOne(id: number): Promise<ProductEntity | null> {
    const record = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
    if (!record) return null;
    return ProductMapper.toEntity(record);
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductEntity> {
    const data = ProductMapper.toPersistenceUpdate(dto);
    const record = await this.prisma.product.update({
      where: { id },
      data,
      include: productInclude,
    });
    return ProductMapper.toEntity(record);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async findByTitle(title: string): Promise<ProductEntity | null> {
    const record = await this.prisma.product.findFirst({
      where: { title },
      include: productInclude,
    });
    return record ? ProductMapper.toEntity(record) : null;
  }
}
