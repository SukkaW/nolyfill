import Arborist from '@npmcli/arborist';
import type { Node, Link } from '@npmcli/arborist';
import { appendArrayInPlace } from 'foxts/append-array-in-place';

import type { PackageNode } from '../types';
import { cache } from '../lib/cache';
import { createNodeRegistry } from './graph';

/**
 * npm's own tree builder reads `package-lock.json` / `npm-shrinkwrap.json` (lockfile v1, v2
 * and v3) without touching `node_modules`. Workspaces are linked into the tree.
 */
export const buildNPMDepTree = cache(async (dirPath: string): Promise<PackageNode[]> => {
  const arb = new Arborist({
    path: dirPath,
    workspacesEnabled: true
  });
  const tree = await arb.loadVirtual();

  return convertToPackageNode(tree).dependencies!;
});

/** workspace packages are symlinks, their dependencies live on the target */
const resolveLink = (npmNode: Node | Link): Node => (npmNode.isLink ? (npmNode as Link).target : npmNode);

function convertToPackageNode(root: Node): PackageNode {
  const registry = createNodeRegistry<Node>();

  function buildNodeFromDep(npmNode: Node): PackageNode {
    const existing = registry.get(npmNode);
    if (existing) return existing;

    const node = registry.create(
      npmNode,
      // `packageName` is the real name of an aliased / overridden package, `name` is the folder name
      npmNode.packageName || npmNode.name,
      npmNode.version || '0.0.0'
    );

    for (const edge of npmNode.edgesOut.values()) {
      // https://github.com/npm/cli/blob/f916d333c16b4f0433d8a304e856b73ed4f949cd/workspaces/arborist/lib/edge.js#L231-L234
      // edge.to can be null if the dependency is optional
      if (edge.to != null) {
        node.dependencies!.push(buildNodeFromDep(resolveLink(edge.to)));
      }
    }

    return node;
  }

  const node = buildNodeFromDep(root);
  // the workspace packages themselves are not dependencies, but their dependencies are
  const result: PackageNode[] = [];
  for (const edge of root.edgesOut.values()) {
    if (edge.to == null) continue;
    // the type definitions don't know about workspace edges yet
    if ((edge.type as string) === 'workspace') {
      appendArrayInPlace(result, buildNodeFromDep(resolveLink(edge.to)).dependencies!);
    } else {
      result.push(buildNodeFromDep(resolveLink(edge.to)));
    }
  }
  node.dependencies = result;
  return node;
}
