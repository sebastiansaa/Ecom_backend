import { Injectable, NotFoundException, Logger, Inject, BadRequestException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ResponseProductDto } from '../dto/';
import * as productRepositoryInterface from '../interfaces/product.repository.interface';
import { FindAllParams } from '../interfaces/find-params';
import { handlePrismaError } from '../../../shared/helpers';
import { CategoryEntity } from '../../../categories/domain/entities/category.entity';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  // 1. Constructor
  constructor(
    @Inject(productRepositoryInterface.PRODUCT_REPOSITORY_TOKEN)
    private readonly repository: productRepositoryInterface.ProductRepository,
  ) {}

  // 2. CRUD principal
  async create(createProductDto: CreateProductDto): Promise<ResponseProductDto> {
    try {
      const product = await this.repository.create(createProductDto);
      return product.toDTO();
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(err.message, err.stack, {
          slug: createProductDto.slug,
        });
      }
      handlePrismaError(err, {
        resource: 'Producto',
        messages: {
          P2002: 'Producto con ese slug ya existe',
          P2003: 'La categoría especificada no existe',
        },
      });
    }
  }

  async findAll(params: FindAllParams = {}): Promise<ResponseProductDto[]> {
    try {
      const products = await this.repository.findAll(params);
      return products.map((p) => p.toDTO());
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(err.message, err.stack, { params });
      }
      handlePrismaError(err, {
        resource: 'Productos',
      });
    }
  }

  async findOne(id: number): Promise<ResponseProductDto> {
    try {
      const product = await this.repository.findOne(id);
      if (!product) throw new NotFoundException(`Producto ${id} no encontrado`);
      return product.toDTO();
    } catch (err: unknown) {
      if (err instanceof NotFoundException) throw err;
      if (err instanceof Error) {
        this.logger.error(err.message, err.stack, { id });
      }
      handlePrismaError(err, { resource: 'Producto' });
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    nuevaCategoria?: CategoryEntity,
  ): Promise<ResponseProductDto> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException(`Producto con id ${id} no existe`);
    product.update({ ...updateProductDto, category: nuevaCategoria });
    await this.repository.update(id, product);
    return product.toDTO();
  }

  async remove(id: number): Promise<void> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    try {
      product.remove(); // Aplica la regla de negocio
      await this.repository.remove(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  // 3. Métodos de negocio adicionales
  async decreaseProductStock(id: number, cantidad: number): Promise<ResponseProductDto> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    product.decreaseStock(cantidad);
    if (product.stock === 0) product.markAsInactive();
    await this.repository.update(id, product);
    return product.toDTO();
  }

  async increaseProductStock(id: number, cantidad: number): Promise<ResponseProductDto> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    product.increaseStock(cantidad);
    await this.repository.update(id, product);
    return product.toDTO();
  }

  async restoreProductStock(id: number, cantidad: number): Promise<ResponseProductDto> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    product.updateStock(cantidad);
    await this.repository.update(id, product);
    return product.toDTO();
  }

  async markProductAsInactive(id: number): Promise<ResponseProductDto> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    product.markAsInactive();
    await this.repository.update(id, product);
    return product.toDTO();
  }

  async markProductAsActive(id: number): Promise<ResponseProductDto> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    product.markAsActive();
    await this.repository.update(id, product);
    return product.toDTO();
  }

  async changeProductDescription(id: number, newDescription: string): Promise<ResponseProductDto> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    product.changeDescription(newDescription);
    await this.repository.update(id, product);
    return product.toDTO();
  }

  async addProductImage(id: number, url: string): Promise<ResponseProductDto> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    product.addImage(url);
    await this.repository.update(id, product);
    return product.toDTO();
  }

  async removeProductImage(id: number, url: string): Promise<ResponseProductDto> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    product.removeImage(url);
    await this.repository.update(id, product);
    return product.toDTO();
  }

  // 4. Métodos utilitarios
  async canProductBePurchased(id: number): Promise<boolean> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product.canBePurchased();
  }

  async isProductActive(id: number): Promise<boolean> {
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product.isActive();
  }
  async updateProductTitle(id: number, newTitle: string): Promise<ResponseProductDto> {
    // busca si el nombre ya existe
    const existing = await this.repository.findByTitle(newTitle);
    if (existing) {
      throw new BadRequestException('Ya existe un producto con ese nombre');
    }
    // 2. Obtener la entidad
    const product = await this.repository.findOne(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    // 3. Actualizar el nombre usando la lógica de la entidad
    product.updateProductTitle(newTitle);
    // 4. Guardar cambios
    await this.repository.update(id, product);
    // 5. Retornar DTO
    return product.toDTO();
  }
}
