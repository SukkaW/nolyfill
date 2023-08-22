import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';

import { fileExists } from '@nolyfill/internal';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export async function detectPackageManager(projectPath: string): Promise<PackageManager> {
  const packageJsonPath = path.join(projectPath, 'package.json');

  if (!await fileExists(packageJsonPath)) {
    throw new Error(`Failed to locate package.json at ${projectPath}`);
  }

  try {
    return Promise.any([
      fsp.access(path.join(projectPath, 'yarn.lock'), fs.constants.F_OK).then<'yarn'>(() => 'yarn'),
      fsp.access(path.join(projectPath, 'pnpm-lock.yaml'), fs.constants.F_OK).then<'pnpm'>(() => 'pnpm'),
      fsp.access(path.join(projectPath, 'package-lock.json'), fs.constants.F_OK).then<'npm'>(() => 'npm'),
      fsp.access(path.join(projectPath, 'npm-shrinkwrap.json'), fs.constants.F_OK).then<'npm'>(() => 'npm'),
      fsp.access(path.join(projectPath, 'bun.lockb'), fs.constants.F_OK).then<'bun'>(() => 'bun')
    ]);
  } catch {
    throw new Error('Can not determine the preferred package manager.');
  }
}
