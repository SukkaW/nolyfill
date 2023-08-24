import { searchPackages } from './lockfile';

import { allPackages } from './all-packages';

import type { PackageNode } from './types';
import type { PackageManager } from './package-manager';

export const findPackagesCoveredByNolyfill = async (packageManager: PackageManager, projectPath: string) => {
  const searchResult = await searchPackages(packageManager, projectPath, allPackages);
  // console.log(renderTree(searchResult));

  const namesOfPackagesToBeOverride = new Set<string>();
  const packagesToBeOverride = new Set<PackageNode>();
  const seen = new WeakSet<PackageNode>();

  const traverse = (node: PackageNode) => {
    if (seen.has(node)) return;

    seen.add(node);

    if (allPackages.includes(node.name)) {
      const {dependencies: _, ...rest} = node;

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
