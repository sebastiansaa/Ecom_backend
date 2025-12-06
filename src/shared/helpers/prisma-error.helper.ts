//para interceptar errores de Prisma y traducirlos en excepciones estándar de NestJS, de forma que la app devuelva respuestas HTTP claras y consistentes.

import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

type PrismaErrorMessages = Partial<Record<string, string>>;

function isPrismaError(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err;
}
/**
 * Maneja errores de Prisma y los mapea a excepciones de NestJS.
 *
 * @param err - El objeto de error (tipo desconocido).
 * @param opts - Opciones para personalizar los mensajes de error y el nombre del recurso.
 * @throws ConflictException (409) para violaciones de restricciones únicas (P2002).
 * @throws NotFoundException (404) para registros faltantes (P2025).
 * @throws BadRequestException (400) para restricciones de clave foránea (P2003).
 * @throws El error original si el código no está contemplado.
 */
export function handlePrismaError(
  err: unknown,
  opts?: { resource?: string; messages?: PrismaErrorMessages },
): never {
  // acceso seguro a la propiedad code
  const code = isPrismaError(err) ? err.code : undefined;

  const resource = opts?.resource ?? 'Recurso';

  // Mensajes personalizados por código (opcional)
  const custom = opts?.messages ?? {};

  if (code === 'P2002') {
    // único constraint fallido
    throw new ConflictException(custom['P2002'] ?? `${resource} ya existe`);
  }

  if (code === 'P2025') {
    // registro no encontrado para actualizar/eliminar
    throw new NotFoundException(custom['P2025'] ?? `${resource} no encontrado`);
  }

  if (code === 'P2003') {
    // restricción de clave foránea fallida
    throw new BadRequestException(custom['P2003'] ?? `Restricción de integridad en ${resource}`);
  }

  // No sabemos cómo mapearlo: rethrow original error para que el caller lo maneje/loggee.
  throw err;
}
