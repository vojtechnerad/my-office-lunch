import { drizzle } from 'drizzle-orm/node-postgres';
import { getDatabaseConfig } from './database-url';

const { databaseUrl, shouldLog } = getDatabaseConfig();

export const db = drizzle({
  connection: databaseUrl,
  logger: shouldLog,
});
