import { defineConfig } from 'drizzle-kit';
import { getDatabaseUrl } from './src/lib/database-url';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/schema.ts',
  out: './src/lib/migrations',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
