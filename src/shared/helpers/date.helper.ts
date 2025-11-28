//- Normalizar cualquier valor que represente una fecha (Date, string, number) a un objeto Date válido, o devolver null si no es interpretable.
export function toDate(value: Date | string | number | null | undefined): Date | null {
    if (value == null) return null;
    const d = value instanceof Date ? value : new Date(value as any);
    return Number.isNaN(d.getTime()) ? null : d;
}


//- Convertir cualquier valor de fecha a un string ISO UTC (YYYY-MM-DDTHH:mm:ss.sssZ), o null si no es válido.
export function formatEntityDate(value: Date | string | number | null | undefined): string | null {
    const d = toDate(value);
    if (!d) return null;
    // Devuelve ISO UTC. Para quitar milisegundos use: d.toISOString().replace(/\.\d{3}Z$/, 'Z')
    return d.toISOString();
}
