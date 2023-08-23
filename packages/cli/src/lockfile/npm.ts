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
  const referenceMap = new WeakMap<Node | Link, PackageNode>();

  function buildNodeFromDep(npmNode: Node | Link): PackageNode {
    if (referenceMap.has(npmNode)) {
      return referenceMap.get(npmNode)!;
    }

    const node: PackageNode = {
      name: npmNode.name,
      version: npmNode.version || npmNode.package.version || '0.0.0',
      dependencies: []
    };

    referenceMap.set(npmNode, node);

    for (const edge of npmNode.edgesOut.values()) {
      // https://github.com/npm/cli/blob/f916d333c16b4f0433d8a304e856b73ed4f949cd/workspaces/arborist/lib/edge.js#L231-L234
      // edge.to can be null if the dependency is optional
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see above
      if (edge.to != null) {
        node.dependencies?.push(buildNodeFromDep(edge.to));
      }
    }

    return node;
  }

  return buildNodeFromDep(npmNode);
}
