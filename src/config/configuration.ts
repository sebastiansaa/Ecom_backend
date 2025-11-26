export default () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV ?? 'development',
});
