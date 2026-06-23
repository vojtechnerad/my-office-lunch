export function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    console.warn('DATABASE_URL is not set.');
    process.exit(1);
  }

  const shouldLog = process.env.LOG_LEVEL !== 'silent';

  return {
    databaseUrl,
    shouldLog,
  };
}
