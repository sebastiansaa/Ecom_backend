import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './domain/services/products.service';
import { CreateProductDto } from './domain/dto/create-product.dto';
import { UpdateProductDto } from './domain/dto/update-product.dto';
import { FindAllQueryDto } from './domain/dto/find-all-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
// Aplicar validación global a los DTO entrantes. "whitelist: true" Elim prop no def en el DTO.
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Accept multipart (optional file) and JSON body together
  @Post()
  @UseInterceptors(FileInterceptor('image')) //Interceptor que procesa la subida de archivos
  @UseGuards(AuthGuard('jwt')) //protejer ruta
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204) //- Fuerza el código de respuesta HTTP a 204 No Content en el DELETE.
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}

/* Decoradores de parámetro
- @Body()
Extrae el cuerpo de la petición y lo mapea al DTO correspondiente.
- @Query()
Extrae parámetros de consulta (?page=1&limit=10) y los mapea al DTO.
- @Param('id', ParseIntPipe)
Extrae el parámetro de ruta id y lo convierte a número con ParseIntPipe.
- @UploadedFile()
Obtiene el archivo subido en una petición multipart (ej. imagen).
*/
