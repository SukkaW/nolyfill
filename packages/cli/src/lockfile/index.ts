import type { PackageManager } from '../package-manager';
import { searchPackagesFromPNPM } from './pnpm';
import { searchPackagesFromNPM } from './npm';
import { searchPackagesFromYarn } from './yarn';

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

export function searchPackages(packageManager: PackageManager, dir: string, packages: string[]) {
  switch (packageManager) {
    case 'npm':
      return searchPackagesFromNPM(dir, packages);
    case 'pnpm':
      return searchPackagesFromPNPM(dir, packages);
    case 'yarn':
      return searchPackagesFromYarn(dir, packages);
    default:
      throw new Error(`Unknown package manager: ${packageManager as string}`);
  }
}
