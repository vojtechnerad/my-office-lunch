import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const DEFAULT_VITEST_DATABASE_URL =
  'postgresql://user:development-database-password@localhost:5433/mol_tmp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(__dirname, '../..');
const databaseProjectRoot = resolve(workspaceRoot, 'packages/database');
const migrationsFolder = resolve(databaseProjectRoot, 'src/lib/migrations');
const testComposeFile = resolve(workspaceRoot, 'docker-compose.test.yaml');

function getVitestDatabaseUrl() {
  const databaseUrl = process.env.VITEST_DATABASE_URL?.trim();

  return databaseUrl || DEFAULT_VITEST_DATABASE_URL;
}

async function waitForDatabase(databaseUrl: string, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;

  while (Date.now() < deadline) {
    const client = new Client({ connectionString: databaseUrl });

    try {
      await client.connect();
      await client.query('select 1');
      await client.end();
      return;
    } catch (error) {
      lastError = error;

      try {
        await client.end();
      } catch {
        // Ignore cleanup failures while the database is still booting.
      }

      await new Promise((resolveDelay) => setTimeout(resolveDelay, 1_000));
    }
  }

  const reason =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Temporary test database did not become ready: ${reason}`);
}

async function resetDatabase(databaseUrl: string) {
  const client = new Client({ connectionString: databaseUrl });

  await client.connect();

  try {
    await client.query('drop schema if exists public cascade');
    await client.query('drop schema if exists drizzle cascade');
    await client.query('create schema public');
  } finally {
    await client.end();
  }
}

async function migrateDatabase(databaseUrl: string) {
  const db = drizzle({
    connection: databaseUrl,
  });

  await migrate(db, { migrationsFolder });
}

export default async function globalSetup() {
  const databaseUrl = getVitestDatabaseUrl();

  process.env.DATABASE_URL = databaseUrl;
  process.env.JWT_SECRET ??= 'vitest-secret';

  execFileSync(
    'docker',
    ['compose', '-f', testComposeFile, 'up', '-d', 'postgres-tmp'],
    {
      cwd: workspaceRoot,
      stdio: 'inherit',
    },
  );

  await waitForDatabase(databaseUrl);
  await resetDatabase(databaseUrl);
  await migrateDatabase(databaseUrl);
}
