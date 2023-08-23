import path from 'path';
import fs, { type PathLike } from 'fs';
import fsp from 'fs/promises';

import { fileExists } from '@nolyfill/internal';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

const checkFile = (path: PathLike) => fsp.access(path, fs.constants.F_OK);

export async function detectPackageManager(projectPath: string): Promise<PackageManager> {
  const packageJsonPath = path.join(projectPath, 'package.json');

  if (!await fileExists(packageJsonPath)) {
    throw new Error(`Failed to locate package.json at ${projectPath}. Are you sure the path is correct?`);
  }

  try {
    return await Promise.any([
      checkFile(path.join(projectPath, 'yarn.lock')).then<'yarn'>(() => 'yarn'),
      checkFile(path.join(projectPath, 'pnpm-lock.yaml')).then<'pnpm'>(() => 'pnpm'),
      checkFile(path.join(projectPath, 'package-lock.json')).then<'npm'>(() => 'npm'),
      checkFile(path.join(projectPath, 'npm-shrinkwrap.json')).then<'npm'>(() => 'npm'),
      checkFile(path.join(projectPath, 'bun.lockb')).then<'bun'>(() => 'bun')
    ]);
  } catch {
    throw new Error('Can not determine the preferred package manager.');
  }
}
