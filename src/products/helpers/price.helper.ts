/**
 * Normalizes a price value to a number with 2 decimal places.
 *
 * @param price - The price to normalize (number or string).
 * @returns A number with 2 decimal places.
 */
export function normalizePriceForPersistence(price: number | string): number {
  const n = typeof price === 'number' ? price : parseFloat(String(price));
  // Forzar 2 decimales y devolver number
  return Number(n.toFixed(2));
}
