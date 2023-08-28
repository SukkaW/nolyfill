import { buildDepTrees } from './lockfile';

import { allPackages } from './all-packages';

import type { PackageNode } from './types';
import type { PackageManager } from './package-manager';

const findPackages = async (packageManager: PackageManager, projectPath: string, packages: string[]) => {
  const packagesSet = new Set(packages);

  const searchResult = await buildDepTrees(packageManager, projectPath);
  // console.log(renderTree(searchResult));

  const namesOfPackagesToBeOverride = new Set<string>();
  const packagesToBeOverride = new Set<PackageNode>();
  const seen = new WeakSet<PackageNode>();

  const traverse = (node: PackageNode) => {
    if (seen.has(node)) return;

    seen.add(node);

    if (packagesSet.has(node.name)) {
      const { dependencies: _, ...rest } = node;

      if (!namesOfPackagesToBeOverride.has(node.name)) {
        namesOfPackagesToBeOverride.add(node.name);
        packagesToBeOverride.add(rest);
      }
    } else if (node.dependencies?.length) {
      return node.dependencies.forEach(traverse);
    }
  };

  searchResult.forEach(node => traverse(node));

  return Array.from(packagesToBeOverride).sort((a, b) => a.name.localeCompare(b.name));
};

export const findPackagesCoveredByNolyfill = (packageManager: PackageManager, projectPath: string) => findPackages(packageManager, projectPath, allPackages);

const detectPackages = [
  'get-intrinsic',
  'es-abstract',
  'call-bind',
  'es-shim-unscopables'
];

export const findPackagesNotCoveredByNolyfill = (packageManager: PackageManager, projectPath: string) => findPackages(packageManager, projectPath, detectPackages);
