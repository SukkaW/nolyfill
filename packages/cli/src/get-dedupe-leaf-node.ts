import type { PackageNode } from './lockfile/types';

export function getDedupeLeafNodes(packageNodes: PackageNode[]): PackageNode[] {
  const leaves: PackageNode[] = [];

  function traverse(node: PackageNode) {
    if (!node.dependencies || node.dependencies.length === 0) {
      if (!leaves.some(leaf => leaf.name === node.name)) {
        leaves.push(node);
      }
    } else {
      node.dependencies.forEach(child => traverse(child));
    }
  }

  packageNodes.forEach(node => traverse(node));

  return leaves;
}
