/**
 * Normaliza cualquier valor con formato de fecha (Date, string, number) a un objeto Date válido.
 * Devuelve null si el valor es null, undefined o no puede convertirse en una fecha válida.
 *
 * @param value - El valor a convertir (Date, string, number, null o undefined).
 * @returns Un objeto Date válido o null.
 */
export function toDate(value: Date | string | number | null | undefined): Date | null {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Convierte cualquier valor con formato de fecha a una cadena ISO en UTC (YYYY-MM-DDTHH:mm:ss.sssZ).
 * Devuelve null si el valor es inválido.
 *
 * @param value - El valor a formatear.
 * @returns La representación en cadena ISO o null.
 */
export function formatEntityDate(value: Date | string | number | null | undefined): string | null {
  const d = toDate(value);
  if (!d) return null;
  return d.toISOString();
}
