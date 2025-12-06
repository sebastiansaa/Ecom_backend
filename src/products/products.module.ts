import { Module } from '@nestjs/common';
import { ProductsService } from './domain/services/products.service';
import { ProductsController } from './products.controller';
import { PrismaProductRepository } from './infrastructure/prisma/repositories/prisma-product.repository';
import { PRODUCT_REPOSITORY_TOKEN } from './domain/interfaces/product.repository.interface';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      // Inyección de la implementación del repositorio
      provide: PRODUCT_REPOSITORY_TOKEN, //token del dominio
      useClass: PrismaProductRepository, //implementación en infraestructura
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
