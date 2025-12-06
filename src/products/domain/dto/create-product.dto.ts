import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsString, Min, IsUrl, IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  stock: number;

  active?: boolean = true;

  @IsInt()
  @Min(1)
  categoryId: number;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({ require_tld: false }, { each: true })
  images: string[];
}
