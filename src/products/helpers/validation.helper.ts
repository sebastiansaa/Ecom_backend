import { BadRequestException } from '@nestjs/common';

/**
 * Validates that the title is present and not empty.
 * @throws BadRequestException if title is invalid.
 */
export function validateTitle(title?: string): void {
  if (title == null || String(title).trim() === '') {
    throw new BadRequestException('El título es obligatorio');
  }
}

/**
 * Validates that the slug is present and not empty.
 * @throws BadRequestException if slug is invalid.
 */
export function validateSlug(slug?: string): void {
  if (slug == null || String(slug).trim() === '') {
    throw new BadRequestException('El slug es obligatorio');
  }
}

/**
 * Validates that the price is a valid non-negative number.
 * @throws BadRequestException if price is invalid.
 */
export function validatePriceValue(price?: number): void {
  if (price == null || typeof price !== 'number' || Number.isNaN(price)) {
    throw new BadRequestException('El precio debe ser un número válido');
  }
  if (price < 0) {
    throw new BadRequestException('El precio no puede ser negativo');
  }
}

/**
 * Validates that the images array contains valid URLs.
 * @throws BadRequestException if images format is invalid.
 */
export function validateImagesFormat(images?: string[] | null): void {
  if (!images) return;
  if (!Array.isArray(images)) {
    throw new BadRequestException('Las imágenes deben ser un arreglo de URLs');
  }
  for (const img of images) {
    if (typeof img !== 'string' || img.trim() === '') {
      throw new BadRequestException('Cada imagen debe ser una URL válida');
    }
    try {
      // Comprueba formato básico de URL
      // new URL lanzará si no es válida
      // Permite data URLs u otros esquemas según decisión de producto
      // aquí se acepta cualquier esquema válido por new URL

      new URL(img);
    } catch {
      throw new BadRequestException(`Imagen inválida: ${img}`);
    }
  }
}
