import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  Min,
  IsUrl,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  categoryId: number;

  @IsArray()
  @IsUrl({ require_tld: false }, { each: true })
  images: string[];
}
