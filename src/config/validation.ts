import { z } from 'zod';

export const validationSchema = z.object({
    DATABASE_URL: z.string().min(1, { message: 'DATABASE_URL is required' }),
    JWT_SECRET: z.string().min(1, { message: 'JWT_SECRET is required' }),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().optional(),
});

export function validateEnv(config: Record<string, any>) {
    return validationSchema.parse(config);
}
