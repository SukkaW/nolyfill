import type { PackageManager } from '../package-manager';
import type { PackageNode } from '../types';
import { buildPNPMDepTree } from './pnpm';
import { buildNPMDepTree } from './npm';
import { buildYarnDepTree } from './yarn';

/**
 * Build the dependency graph of a project (and all of its workspace packages) from its lockfile.
 *
 * Only the lockfile is read, `node_modules` doesn't have to be installed. The returned nodes
 * are the direct dependencies of every workspace project, nodes reachable from multiple
 * places are shared (the graph may contain cycles).
 */
export function buildDepTrees(packageManager: PackageManager, dir: string): Promise<PackageNode[]> {
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
