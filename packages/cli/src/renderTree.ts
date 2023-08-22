/* eslint-disable no-nested-ternary -- readability */
import picocolors from 'picocolors';
import type { PackageNode } from './lockfile/types';

export function renderTree(packageNodes: PackageNode[]): string {
  let result = '';

  function printNode(node: PackageNode, prefix: string, last: boolean, isRoot = false) {
    // Handle tree branching visuals
    const branch = isRoot ? '' : (last ? '└─' : '├─');
    const connector = isRoot ? '' : (node.dependencies && node.dependencies.length > 0 ? '┬' : '─');
    const childPrefix = last ? '  ' : '│ ';

    result += `${prefix}${branch}${connector} ${picocolors.blue(node.name)} ${picocolors.dim(node.version)}\n`;

    if (node.dependencies) {
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
