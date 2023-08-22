import { searchPackages } from './lockfile';

import { allPackages } from './all-packages';

import type { PackageNode } from './types';
import type { PackageManager } from './package-manager';

export const findPackagesCoveredByNolyfill = async (packageManager: PackageManager, projectPath: string) => {
  const searchResult = await searchPackages(packageManager, projectPath, allPackages);
  // console.log(renderTree(searchResult));

  const packagesToBeOverride: PackageNode[] = [];

  const traverse = (node: PackageNode) => {
    if (allPackages.includes(node.name) && !packagesToBeOverride.some(leaf => leaf.name === node.name)) {
      delete node.dependencies;
      packagesToBeOverride.push(node);
    } else if (node.dependencies) {
      node.dependencies.forEach(child => traverse(child));
    }
  };

  searchResult.forEach(node => traverse(node));

  return packagesToBeOverride.sort((a, b) => a.name.localeCompare(b.name));
};
