/* eslint-disable no-nested-ternary -- readability */
import picocolors from 'picocolors';
import type { PackageNode } from './lockfile/types';

export function renderTree(packageNodes: PackageNode[], targetPackages: string[]): string {
  let result = '';

  function printNode(node: PackageNode, prefix: string, last: boolean, isRoot = false) {
    // Handle tree branching visuals
    const matched = targetPackages.includes(node.name);
    const branch = isRoot ? '' : (last ? '└─' : '├─');
    const connector = isRoot ? '' : (!matched && node.dependencies && node.dependencies.length > 0 ? '┬' : '─');
    const childPrefix = last ? '  ' : '│ ';

    result += `${prefix}${branch}${connector} ${picocolors.blue(node.name)} ${picocolors.dim(node.version)}\n`;

    if (!matched && node.dependencies) {
      node.dependencies.forEach((child, index, array) => {
        const isLastChild = index === array.length - 1;
        printNode(child, prefix + childPrefix, isLastChild);
      });
    }
  }

  // Loop through each root node in the array
  packageNodes.forEach((node, index, array) => {
    const isLast = index === array.length - 1;
    printNode(node, '', isLast, true);
  });

  return result;
}
