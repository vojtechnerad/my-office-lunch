import z from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.url(),
  LOG_LEVEL: z.enum(['silent', 'error', 'warn', 'info', 'debug']),
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid env', parsedEnv.error.message);
  process.exit(1);
}

const env = parsedEnv.data;

export { env };
