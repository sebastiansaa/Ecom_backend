// "Normaliza" el campo de imágenes para asegurar que siempre es un array de strings.
export function normalizeImages(images?: string[] | null): string[] {
    if (!images) return [];
    return Array.isArray(images) ? images : [];
}