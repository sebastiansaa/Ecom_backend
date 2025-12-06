import { Expose } from 'class-transformer';

export class CategoryResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
