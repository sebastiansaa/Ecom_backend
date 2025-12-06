/**
 * NORMALIZA las imágenes, siempre son un array de strings.
 *
 * @param images - The images array or null/undefined.
 * @returns An array of strings (empty if input is null/undefined).
 */
export function normalizeImages(images?: string[] | null): string[] {
  if (!images) return [];
  return Array.isArray(images) ? images : [];
}
