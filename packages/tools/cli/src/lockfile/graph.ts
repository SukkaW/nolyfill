import type { PackageNode } from '../types';

/**
 * Registry of graph nodes keyed by their identity inside the lockfile (dep path, lockfile
 * entry...). Every lockfile reader uses it to make sure a package that is depended on from
 * multiple places is represented by a single (possibly cyclic) node.
 */
export function createNodeRegistry<K>() {
  const nodes = new Map<K, PackageNode>();

  return {
    get(key: K) {
      return nodes.get(key);
    },
    create(key: K, name: string, version: string): PackageNode {
      const node: PackageNode = { name, version, dependencies: [] };
      nodes.set(key, node);
      return node;
    }
  };
}

/** Collect the entries of several dependency maps, keeping the first spec seen for a name */
export function mergeDependencyMaps(...maps: Array<Record<string, string> | undefined>): Array<[name: string, spec: string]> {
  const seen = new Set<string>();
  const result: Array<[string, string]> = [];
  for (let i = 0, len = maps.length; i < len; i++) {
    const map = maps[i];
    if (!map) continue;
    const names = Object.keys(map);
    for (let j = 0, l = names.length; j < l; j++) {
      const name = names[j];
      if (!seen.has(name)) {
        seen.add(name);
        result.push([name, map[name]]);
      }
    }
  }
  return result;
}
