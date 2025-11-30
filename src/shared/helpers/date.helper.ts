/**
 * Normalizes any date-like value (Date, string, number) to a valid Date object.
 * Returns null if the value is null, undefined, or cannot be parsed into a valid Date.
 *
 * @param value - The value to convert (Date, string, number, null, or undefined).
 * @returns A valid Date object or null.
 */
export function toDate(
  value: Date | string | number | null | undefined,
): Date | null {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Converts any date-like value to an ISO UTC string (YYYY-MM-DDTHH:mm:ss.sssZ).
 * Returns null if the value is invalid.
 *
 * @param value - The value to format.
 * @returns The ISO string representation or null.
 */
export function formatEntityDate(
  value: Date | string | number | null | undefined,
): string | null {
  const d = toDate(value);
  if (!d) return null;
  return d.toISOString();
}
