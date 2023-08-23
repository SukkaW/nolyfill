import type { PackageNode } from '../types';
import type { Node, Link } from '@npmcli/arborist';
import type Arborist from '@npmcli/arborist';
// @ts-expect-error -- patched package
import PatchedArborist from '../npm/arborist.cjs';

export async function searchPackagesFromNPM(dirPath: string, _packages: string[]): Promise<PackageNode[]> {
  const arb: Arborist = new PatchedArborist({
    path: dirPath,
    workspacesEnabled: true
  });
  const tree = await arb.loadVirtual();

  const node = convertToPackageNode(tree);

  return node.dependencies || [];
}

function convertToPackageNode(npmNode: Node | Link): PackageNode {
  const cache = new Map<string, PackageNode>();

  function buildNodeFromDep(npmNode: Node | Link): PackageNode {
    if (cache.has(npmNode.name)) {
      return cache.get(npmNode.name)!;
    }

    const node: PackageNode = {
      name: npmNode.name,
      version: npmNode.version || npmNode.package.version || '0.0.0',
      dependencies: []
    };

    cache.set(npmNode.name, node);

    for (const edge of npmNode.edgesOut.values()) {
      if (edge.to != null) {
        node.dependencies?.push(buildNodeFromDep(edge.to));
      }
    }

    return node;
  }

  return buildNodeFromDep(npmNode);
}
