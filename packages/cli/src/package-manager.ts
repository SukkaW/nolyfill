import fs from 'node:fs';
import path from 'node:path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export async function detectPackageManager(projectPath: string): Promise<PackageManager> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`Failed to locate package.json at ${projectPath}`);
  }

  const dirname = path.dirname(packageJsonPath);

  if (fs.existsSync(path.join(dirname, 'yarn.lock'))) {
    return 'yarn';
  }

  if (fs.existsSync(path.join(dirname, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  if (
    fs.existsSync(path.join(dirname, 'package-lock.json'))
  || fs.existsSync(path.join(dirname, 'npm-shrinkwrap.json'))
  ) {
    return 'npm';
  }

  if (fs.existsSync(path.join(dirname, 'bun.lockb'))) {
    return 'bun';
  }

  throw new Error('No lockfile found.');
}
