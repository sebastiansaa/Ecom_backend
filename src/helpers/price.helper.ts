export function normalizePriceForPersistence(price: number | string): number {
    const n = typeof price === 'number' ? price : parseFloat(String(price));
    // Forzar 2 decimales y devolver number
    return Number(n.toFixed(2));
}
