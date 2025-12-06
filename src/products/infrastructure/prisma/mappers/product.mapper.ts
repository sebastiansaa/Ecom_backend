import { CreateProductDto } from '../../../domain/dto/create-product.dto';
import { ResponseProductDto } from '../../../domain/dto/response-product.dto';
import { ProductEntity } from '../../../domain/entities/product.entity';
import { normalizePriceForPersistence } from '../../../domain/helpers/price.helper';
import { normalizeImages } from '../../../domain/helpers/normalizeImg.helper';
import { Prisma } from '@prisma/client';
import { ProductPrismaRecord } from '../types/product-prisma.type';

export class ProductMapper {
  static toPersistence(dto: CreateProductDto): Prisma.ProductCreateInput {
    return {
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      images: normalizeImages(dto.images),
      price: normalizePriceForPersistence(dto.price),
      category: { connect: { id: dto.categoryId } },
    };
  }

  static toPersistenceUpdate(dto: Partial<CreateProductDto>): Prisma.ProductUpdateInput {
    const data: Prisma.ProductUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.images !== undefined) data.images = normalizeImages(dto.images);
    if (dto.price !== undefined) data.price = normalizePriceForPersistence(dto.price);
    if (dto.categoryId !== undefined) data.category = { connect: { id: dto.categoryId } };
    return data;
  }

  static toEntity(record: ProductPrismaRecord): ProductEntity {
    return new ProductEntity(record);
  }

  static toDTO(entity: ProductEntity): ResponseProductDto {
    return entity.toDTO();
  }

  static toDTOFromRecord(record: ProductPrismaRecord): ResponseProductDto {
    return this.toDTO(this.toEntity(record));
  }
}
