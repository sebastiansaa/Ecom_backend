import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './domain/services/categories.service';
// import { PrismaCategoryRepository } from './infrastructure/prisma/repositories/prisma-category.repository';
// import { CATEGORY_REPOSITORY_TOKEN } from './domain/interfaces/category.repository.interface';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    // TODO: Proveer el repositorio (useClass: PrismaCategoryRepository)
  ],
})
export class CategoriesModule {}
