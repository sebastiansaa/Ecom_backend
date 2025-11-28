//validar/transformar los query params de la ruta GET /products
import { IsInt, IsOptional, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    take?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    skip?: number;

    @IsOptional()
    @IsString()
    q?: string;
}
