import path from 'node:path';
import type { PackageNode } from './types';
import { readJSON } from '../packages';

interface NpmDep {
  version: string,
  requires?: {
    [depName: string]: string
  },
  dependencies?: {
    [depName: string]: NpmDep
  }
}

interface NpmLockfile {
  name: string,
  version: string,
  lockfileVersion: number,
  requires: boolean,
  packages: {
    ''?: {
      name: string,
      version: string,
      dependencies?: {
        [depName: string]: string
      },
      devDependencies?: {
        [depName: string]: string
      }
    }
  },
  dependencies?: {
    [depName: string]: NpmDep
  }
}

export async function searchPackagesFromNPM(dirPath: string, packages: string[]): Promise<PackageNode[]> {
  const shrinkwrapPath = path.join(dirPath, 'npm-shrinkwrap.json');
  const packageLockPath = path.join(dirPath, 'package-lock.json');
  const lockfile = await readJSON<NpmLockfile>(shrinkwrapPath)
                ?? await readJSON<NpmLockfile>(packageLockPath);
  if (!lockfile) {
    throw new Error(`No npm lockfile found in ${dirPath}`);
  }

  const rootNode = convertToPackageNodeTree(lockfile);
  const result = searchTree(rootNode, packages);
  return result ? [result] : [];
}

function convertToPackageNodeTree(npmLockfile: NpmLockfile): PackageNode {
  const cache: Record<string, PackageNode> = {};

  function buildNodeFromDep(depName: string, npmDep: NpmDep): PackageNode {
    if (cache[depName]) return structuredClone(cache[depName]);

    const node: PackageNode = {
      name: depName,
      version: npmDep.version,
      dependencies: []
    };

    cache[depName] = node;

    if (npmDep.requires) {
      for (const requiredDepName of Object.keys(npmDep.requires)) {
        const requiredNpmDep = npmDep.dependencies?.[requiredDepName]
          ?? npmLockfile.dependencies?.[requiredDepName];

        if (requiredNpmDep) {
          node.dependencies!.push(buildNodeFromDep(requiredDepName, requiredNpmDep));
        }
      }
    }

    return node;
  }

  // Start with the root package
  const rootNode: PackageNode = {
    name: npmLockfile.name,
    version: npmLockfile.version,
    dependencies: []
  };

  const rootPackage = npmLockfile.packages[''];
  if (rootPackage) {
    const deps = [
      ...Object.keys(rootPackage.dependencies ?? {}),
      ...Object.keys(rootPackage.devDependencies ?? {})
    ];
    for (const depName of deps) {
      const dep = npmLockfile.dependencies?.[depName];
      if (dep) {
        rootNode.dependencies!.push(buildNodeFromDep(depName, dep));
      }
    }
  }

  return rootNode;
}

function searchTree(root: PackageNode, packageNames: string[]): PackageNode | null {
  if (root._seen) return null;
  root._seen = true;

  const matched = packageNames.includes(root.name);
  let hasMatchedChild = false;

  if (root.dependencies) {
    // Clone dependencies to avoid mutating the original tree
    root.dependencies = root.dependencies.map(dep => {
      const searched = searchTree(dep, packageNames);
      if (searched) {
        hasMatchedChild = true;
        return searched;
      }
      return null;
    }).filter(Boolean) as PackageNode[];
  }

  // If this node matches, or any of its descendants match, then include it in the result.
  if (matched || hasMatchedChild) {
    const resultNode: PackageNode = {
      name: root.name,
      version: root.version
    };

    if (!matched && root.dependencies && root.dependencies.length > 0) {
      resultNode.dependencies = root.dependencies;
    }

    return resultNode;
  }

  return null;
}
