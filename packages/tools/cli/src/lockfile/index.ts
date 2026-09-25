import type { PackageManager } from '../package-manager';
import { buildPNPMDepTree } from './pnpm';
import { buildNPMDepTree } from './npm';
import { buildYarnDepTree } from './yarn';
import fsp from 'node:fs/promises';
import path from 'node:path';

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

const rLockfileVersion = /^lockfileVersion: ["']?(\d*(?:\.\d*)?)["']?$/m;

export async function getPNPMLockfileVersion(dir: string) {
  const content = await fsp.readFile(path.resolve(dir, 'pnpm-lock.yaml'), 'utf-8');
  const [, lockfileVersion] = (rLockfileVersion.exec(content)) ?? [];

  if (lockfileVersion) return lockfileVersion;

  throw new Error('Can\'t detect lockfile version');
}
