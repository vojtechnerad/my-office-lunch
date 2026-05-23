import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({
  connection:
    'postgresql://user:development-database-password@localhost:5432/mol',
  logger: true,
});
