import z from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  // LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']),
});

let env: z.infer<typeof EnvSchema>;

try {
  env = EnvSchema.parse(process.env);
} catch (e) {
  // TODO better log
  console.error('Invalid env');
  process.exit(1);
}

export { env };
