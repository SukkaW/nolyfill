import fsp from 'fs/promises';
import path from 'path';
import { parseSyml } from '@yarnpkg/parsers/lib/syml';

import type { PackageNode } from '../types';
import { cache } from '../lib/cache';

interface Dependency {
  [packageName: string]: string
}

interface FirstLevelDependency {
  version: string,
  resolved?: string | undefined,
  dependencies?: Dependency | undefined
}

export const buildYarnDepTree = cache(async (dirPath: string): Promise<PackageNode[]> => {
  const yarnLockPath = path.join(dirPath, 'yarn.lock');
  return searchInLockfile(await fsp.readFile(yarnLockPath, 'utf-8'));
});

function searchInLockfile(lockFileContents: string) {
  const yarnYml = parseSyml(lockFileContents);
  delete yarnYml.__metadata;

  const referenceMap = new Map<string, PackageNode>();
  const createPackageNode = (packageName: string, version: string, yarnPkg?: FirstLevelDependency): PackageNode => {
    if (referenceMap.has(packageName)) {
      return referenceMap.get(packageName)!;
    }

    const packageNode: PackageNode = {
      // After yarn overrides, the package name remains the original one,
      // while the "resolved" has been pointed to the new package's tarball.
      name: (
        yarnPkg?.resolved?.includes(`/@nolyfill/${packageName}/`)
        || (
          yarnPkg
          && 'resolution' in yarnPkg
          && typeof yarnPkg.resolution === 'string'
          && yarnPkg.resolution.startsWith(`@nolyfill/${packageName}`)
        )
      )
        ? `@nolyfill/${packageName}`
        : packageName,
      version,
      dependencies: []
    };
    referenceMap.set(packageName, packageNode);

    packageNode.dependencies = Object.entries(yarnPkg?.dependencies || {}).map(([depName, depVersion]) => {
      return createPackageNode(depName, depVersion);
    });
    return packageNode;
  };

  const packageNodes: PackageNode[] = [];

  Object.keys(yarnYml).forEach((descriptor) => {
    const pkg = yarnYml[descriptor] as FirstLevelDependency;
    packageNodes.push(createPackageNode(getPackageNameFromDescriptor(descriptor), pkg.version, pkg));
  });

  return packageNodes;
}

function getPackageNameFromDescriptor(descriptor: string): string {
  // example: signal-exit@npm:^3.0.0, signal-exit@npm:^3.0.2
  // example: @types/node@npm:^16.0.0, @types/node@npm:^18.0.0
  // example: has@^1.0.3, has@npm:@nolyfill/has@latest

  const firstDescriptor = descriptor.split(',')[0];

  const s = firstDescriptor.includes('@npm:')
    ? firstDescriptor.split('@npm:')[0]
    : firstDescriptor;

  return s.startsWith('@')
    ? s.slice(0, s.indexOf('@', 1))
    : s.split('@')[0];
}
