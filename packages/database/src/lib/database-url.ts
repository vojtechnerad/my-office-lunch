export function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    console.warn('DATABASE_URL is not set.');
    process.exit(1);
  }

  return databaseUrl;
}
