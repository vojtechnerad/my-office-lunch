import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Reporter } from 'vitest/reporters';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(__dirname, '../..');
const testComposeFile = resolve(workspaceRoot, 'docker-compose.test.yaml');

let cleanupRegistered = false;

function cleanupTemporaryDatabase() {
  execFileSync(
    'docker',
    ['compose', '-f', testComposeFile, 'rm', '-sfv', 'postgres-tmp'],
    {
      cwd: workspaceRoot,
      stdio: 'inherit',
    },
  );
}

export default class VitestCleanupReporter implements Reporter {
  onTestRunEnd(
    _testModules?: readonly unknown[],
    _unhandledErrors?: readonly unknown[],
    reason?: 'passed' | 'interrupted' | 'failed',
  ): void {
    if (reason !== 'passed' || cleanupRegistered) {
      return;
    }

    cleanupRegistered = true;
    process.once('exit', cleanupTemporaryDatabase);
  }
}
