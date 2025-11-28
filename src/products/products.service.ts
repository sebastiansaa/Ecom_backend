import { Injectable, ConflictException, NotFoundException, Logger, } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ResponseProductDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductEntity } from './entities/product.entity';
import { ProductWithCategory, FindAllParams } from './interfaces';
import type { Prisma } from '@prisma/client';
import { normalizePriceForPersistence } from 'src/products/helpers/price.helper';
import { validateCategoryExists, normalizeImages } from './helpers';


@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto): Promise<ResponseProductDto> {
    // Validar categoría con helper
    await validateCategoryExists(this.prisma, createProductDto.categoryId);

    const data: Prisma.ProductCreateInput = {
      title: createProductDto.title,
      slug: createProductDto.slug,
      description: createProductDto.description,
      images: normalizeImages(createProductDto.images),
      price: normalizePriceForPersistence(createProductDto.price),
      category: { connect: { id: createProductDto.categoryId } },
    };

    try {
      const product = (await this.prisma.product.create({
        data,
        include: { category: true },
      })) as ProductWithCategory;

      return new ProductEntity(product).toDTO();
    } catch (err: any) {
      this.logger.error(err?.message, err?.stack, { slug: createProductDto.slug });
      if (err?.code === 'P2002') {
        throw new ConflictException('Producto con ese slug ya existe');
      }
      throw err;
    }
  }

  async findAll(params: FindAllParams = {}): Promise<ResponseProductDto[]> {
    const { take = 20, skip = 0, q } = params;
    const MAX_TAKE = 100;
    const sanitizedTake = Math.min(Math.max(1, take), MAX_TAKE);

    const where: Prisma.ProductWhereInput | undefined = q
      ? {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      }
      : undefined;

    const products = (await this.prisma.product.findMany({
      where,
      include: { category: true },
      take: sanitizedTake,
      skip,
      orderBy: { createdAt: 'desc' },
    })) as ProductWithCategory[];

    return products.map((p) => new ProductEntity(p).toDTO());
  }

  async findOne(id: number): Promise<ResponseProductDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }

    return new ProductEntity(product as ProductWithCategory).toDTO();
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
  ): Promise<ResponseProductDto> {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!existing) {
      throw new NotFoundException(`Producto con id ${id} no existe`);
    }

    if (updateProductDto.categoryId) {
      await validateCategoryExists(this.prisma, updateProductDto.categoryId);
    }

    const data: Partial<Prisma.ProductUpdateInput> = {};

    if (updateProductDto.title !== undefined) data.title = updateProductDto.title;
    if (updateProductDto.slug !== undefined) data.slug = updateProductDto.slug;
    if (updateProductDto.description !== undefined)
      data.description = updateProductDto.description;
    if (updateProductDto.images !== undefined)
      data.images = normalizeImages(updateProductDto.images) ?? existing.images;
    if (updateProductDto.price !== undefined)
      data.price = normalizePriceForPersistence(updateProductDto.price);
    if (updateProductDto.categoryId !== undefined)
      data.category = { connect: { id: updateProductDto.categoryId } };

    try {
      const product = (await this.prisma.product.update({
        where: { id },
        data,
        include: { category: true },
      })) as ProductWithCategory;

      return new ProductEntity(product).toDTO();
    } catch (err: any) {
      this.logger.error(err?.message, err?.stack, { id });
      if (err?.code === 'P2002') {
        throw new ConflictException('Producto con ese slug ya existe');
      }
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.product.delete({ where: { id } });
    } catch (err: any) {
      this.logger.error(err?.message, err?.stack, { id });
      if (err?.code === 'P2025') {
        throw new NotFoundException(`Producto ${id} no encontrado`);
      }
      throw err;
    }
  }
}
