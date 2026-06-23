export function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    console.warn('DATABASE_URL is not set.');
    process.exit(1);
  }

  const logLevelsToLog = ['debug', 'trace'];
  const shouldLog = logLevelsToLog.includes(process.env.LOG_LEVEL ?? 'error');

  return {
    databaseUrl,
    shouldLog,
  };
}
