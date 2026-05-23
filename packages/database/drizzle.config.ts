import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/schema.ts',
  out: './src/lib/migrations',
  dbCredentials: {
    url: 'postgresql://user:development-database-password@localhost:5432/mol', // TODO move to env variable
  },
});
