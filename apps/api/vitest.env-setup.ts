const vitestDatabaseUrl =
  process.env.VITEST_DATABASE_URL?.trim() ||
  'postgresql://user:development-database-password@localhost:5433/mol_tmp';

process.env.DATABASE_URL = vitestDatabaseUrl;
process.env.JWT_SECRET ??= 'vitest-secret';
