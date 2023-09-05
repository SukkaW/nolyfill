import type { PackageManager } from '../package-manager';
import { buildPNPMDepTree } from './pnpm';
import { buildNPMDepTree } from './npm';
import { buildYarnDepTree } from './yarn';

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
