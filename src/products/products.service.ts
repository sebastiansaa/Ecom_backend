import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ResponseProductDto } from './dto';
import { ProductsRepository } from './products.repository';
import { ProductMapper } from './mappers/product.mapper';
import { FindAllParams } from './interfaces';
import type { Prisma } from '@prisma/client';
import {
  validateTitle,
  validateSlug,
  validatePriceValue,
  validateImagesFormat,
} from './helpers';
import { handlePrismaError } from 'src/shared/helpers';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly repository: ProductsRepository) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ResponseProductDto> {
    // Validar categoría
    const categoryExists = await this.repository.checkCategory(
      createProductDto.categoryId,
    );
    if (!categoryExists) {
      throw new BadRequestException('La categoría especificada no existe');
    }

    // Reglas de integridad de negocio
    validateTitle(createProductDto.title);
    validateSlug(createProductDto.slug);
    validatePriceValue(createProductDto.price);
    validateImagesFormat(createProductDto.images);

    const data = ProductMapper.toPersistence(createProductDto);

    try {
      const product = await this.repository.create(data);
      return ProductMapper.toDTO(ProductMapper.toEntity(product));
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message, err.stack, {
          slug: createProductDto.slug,
        });
      }
      handlePrismaError(err, {
        resource: 'Producto',
        messages: { P2002: 'Producto con ese slug ya existe' },
      });
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

    const products = await this.repository.findAll({
      where,
      take: sanitizedTake,
      skip,
    });

    return products.map((p) => ProductMapper.toDTO(ProductMapper.toEntity(p)));
  }

  async findOne(id: number): Promise<ResponseProductDto> {
    const product = await this.repository.findOne(id);

    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }

    return ProductMapper.toDTO(ProductMapper.toEntity(product));
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
  ): Promise<ResponseProductDto> {
    const existing = await this.repository.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Producto con id ${id} no existe`);
    }

    if (updateProductDto.categoryId) {
      const categoryExists = await this.repository.checkCategory(
        updateProductDto.categoryId,
      );
      if (!categoryExists) {
        throw new BadRequestException('La categoría especificada no existe');
      }
    }

    // Validaciones solo para campos presentes
    if (updateProductDto.title !== undefined)
      validateTitle(updateProductDto.title);
    if (updateProductDto.slug !== undefined)
      validateSlug(updateProductDto.slug);
    if (updateProductDto.price !== undefined)
      validatePriceValue(updateProductDto.price);
    if (updateProductDto.images !== undefined)
      validateImagesFormat(updateProductDto.images ?? undefined);

    // Construir payload de update usando Mapper
    const data = ProductMapper.toPersistenceUpdate(updateProductDto);

    try {
      const product = await this.repository.update(id, data);
      return ProductMapper.toDTO(ProductMapper.toEntity(product));
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message, err.stack, { id });
      }
      handlePrismaError(err, {
        resource: 'Producto',
        messages: { P2002: 'Producto con ese slug ya existe' },
      });
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.repository.remove(id);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message, err.stack, { id });
      }
      handlePrismaError(err, {
        resource: 'Producto',
        messages: { P2025: `Producto ${id} no encontrado` },
      });
    }
  }
}
