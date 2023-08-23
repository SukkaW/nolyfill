import { searchPackages } from './lockfile';

import { allPackages } from './all-packages';

import type { PackageNode } from './types';
import type { PackageManager } from './package-manager';

export const findPackagesCoveredByNolyfill = async (packageManager: PackageManager, projectPath: string) => {
  const searchResult = await searchPackages(packageManager, projectPath, allPackages);
  // console.log(renderTree(searchResult));

  const packagesToBeOverride: PackageNode[] = [];
  const seen = new Set<string>();

  const traverse = (node: PackageNode) => {
    if (seen.has(node.name)) return;

    if (allPackages.includes(node.name)) {
      seen.add(node.name);
      const {dependencies: _, ...rest} = node;
      packagesToBeOverride.push(rest);
    } else if (node.dependencies?.length) {
      return node.dependencies.forEach(traverse);
    }
  };

  searchResult.forEach(node => traverse(node));

  return packagesToBeOverride.sort((a, b) => a.name.localeCompare(b.name));
};
