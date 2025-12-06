import { Expose, Type } from 'class-transformer';
import { CategoryResponseDto } from '../../../categories/domain/dto';

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
  stock: number;

  @Expose()
  active: boolean;

  @Expose()
  images: string[];

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  @Type(() => CategoryResponseDto) // Indicar a class-transformer que use este DTO anidado
  category: CategoryResponseDto;
}

//@expose => la prop debe incluirse al transf la class a un obj plano (por ejemplo, al serializar a JSON).
//@type => indica a class-transformer qué clase usar para transformar propiedades anidadas.
