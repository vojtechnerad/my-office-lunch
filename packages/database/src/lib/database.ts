import { drizzle } from 'drizzle-orm/node-postgres';
import { getDatabaseUrl } from './database-url';

export const db = drizzle({
  connection: getDatabaseUrl(),
  logger: true,
});
