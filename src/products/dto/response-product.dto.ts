import { Expose, Type } from 'class-transformer';
import { CategoryResponseDto } from 'src/categories/dto/response-category.dto';

export class ResponseProductDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  price: number;

  @Expose()
  description: string;

  @Expose()
  @Type(() => CategoryResponseDto) // Indicar a class-transformer que use este DTO anidado
  category: CategoryResponseDto;

  @Expose()
  images: string[];

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
