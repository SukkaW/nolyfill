import path from 'node:path';

import { fileExists } from '@nolyfill/internal';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export async function detectPackageManager(projectPath: string): Promise<PackageManager> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!await fileExists(packageJsonPath)) {
    throw new Error(`Failed to locate package.json at ${projectPath}`);
  }

  if (await fileExists(path.join(projectPath, 'yarn.lock'))) {
    return 'yarn';
  }

  if (await fileExists(path.join(projectPath, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  if (
    await fileExists(path.join(projectPath, 'package-lock.json'))
    || await fileExists(path.join(projectPath, 'npm-shrinkwrap.json'))
  ) {
    return 'npm';
  }

  if (await fileExists(path.join(projectPath, 'bun.lockb'))) {
    return 'bun';
  }

  throw new Error('No lockfile found.');
}
