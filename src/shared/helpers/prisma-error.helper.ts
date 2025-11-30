import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

type PrismaErrorMessages = Partial<Record<string, string>>;

function isPrismaError(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err;
}

/**
 * Handles Prisma errors and maps them to NestJS exceptions.
 *
 * @param err - The error object (unknown type).
 * @param opts - Options to customize the error messages and resource name.
 * @throws ConflictException (409) for unique constraint violations (P2002).
 * @throws NotFoundException (404) for missing records (P2025).
 * @throws BadRequestException (400) for foreign key constraints (P2003).
 * @throws The original error if the code is not handled.
 */
export function handlePrismaError(
  err: unknown,
  opts?: { resource?: string; messages?: PrismaErrorMessages },
): never {
  // Safe access to 'code' property
  const code = isPrismaError(err) ? err.code : undefined;

  const resource = opts?.resource ?? 'Recurso';

  // Mensajes personalizados por código (opcional)
  const custom = opts?.messages ?? {};

  if (code === 'P2002') {
    // Unique constraint failed
    throw new ConflictException(custom['P2002'] ?? `${resource} ya existe`);
  }

  if (code === 'P2025') {
    // Record not found for update/delete
    throw new NotFoundException(custom['P2025'] ?? `${resource} no encontrado`);
  }

  if (code === 'P2003') {
    // Foreign key constraint failed
    throw new BadRequestException(
      custom['P2003'] ?? `Restricción de integridad en ${resource}`,
    );
  }

  // No sabemos cómo mapearlo: rethrow original error para que el caller lo maneje/loggee.
  throw err;
}
