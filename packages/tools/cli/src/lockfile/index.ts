import type { PackageManager } from '../package-manager';
import { buildPNPMDepTree } from './pnpm';
import { buildNPMDepTree } from './npm';
import { buildYarnDepTree } from './yarn';
import fsp from 'fs/promises';
import path from 'path';

export interface PackageLockDeps {
  [depName: string]: PackageLockDep
}

export interface PackageLockDep {
  version: string,
  requires?: {
    [depName: string]: string
  },
  dependencies?: PackageLockDeps,
  dev?: boolean
}

// TODO: make it do dep tree generation only
export function buildDepTrees(packageManager: PackageManager, dir: string) {
  switch (packageManager) {
    case 'npm':
      return buildNPMDepTree(dir);
    case 'pnpm':
      return buildPNPMDepTree(dir);
    case 'yarn':
      return buildYarnDepTree(dir);
    default:
      throw new Error(`Unknown package manager: ${packageManager as string}`);
  }
}

export async function getPNPMLockfileVersion(dir: string) {
  const content = await fsp.readFile(path.resolve(dir, 'pnpm-lock.yaml'), 'utf-8');
  const [, lockfileVersion] = content.match(/^lockfileVersion: '?(\d*(?:.\d*)?)'?$/m) ?? [];

  if (!lockfileVersion)
    throw new Error(`Can't detect lockfile version`)

  return lockfileVersion;
}
