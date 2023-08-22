import type { PackageNode } from './types';
import type { Node } from '@npmcli/arborist';
import Arborist from '@npmcli/arborist';

export async function searchPackagesFromNPM(dirPath: string, packages: string[]): Promise<PackageNode[]> {
  const arb = new Arborist({
    path: dirPath,
    workspacesEnabled: true
  });
  const tree = await arb.loadVirtual();

  const queryString = packages.map(pkg => `:attr([name=${pkg}])`).join(',');
  const items = await tree.querySelectorAll(queryString);

  return convertToPackageNodeTree(items);
}

function convertToPackageNodeTree(npmNodes: Node[]): PackageNode[] {
  function buildNodeFromDep(npmNode: Node): PackageNode {
    const node: PackageNode = {
      name: npmNode.package.name ?? npmNode.name,
      version: npmNode.package.version ?? '0.0.0',
      dependencies: []
    };

    npmNode.children.forEach(child => {
      node.dependencies!.push(buildNodeFromDep(child));
    });

    return node;
  }

  return npmNodes.map(npmNode => buildNodeFromDep(npmNode));
}
