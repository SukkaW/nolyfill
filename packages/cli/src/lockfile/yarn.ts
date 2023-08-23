import fsp from 'fs/promises';
import path from 'path';
import { parseSyml } from '@yarnpkg/parsers';

import type { PackageNode } from '../types';

interface Dependency {
  [packageName: string]: string
}

interface FirstLevelDependency {
  version: string,
  resolved?: string | undefined,
  dependencies?: Dependency | undefined
}

export async function searchPackagesFromYarn(dirPath: string, packages: string[]): Promise<PackageNode[]> {
  const yarnLockPath = path.join(dirPath, 'yarn.lock');
  return searchInLockfile(await fsp.readFile(yarnLockPath, 'utf-8'), packages);
}

function searchInLockfile(lockFileContents: string, packages: string[]) {
  const yarnYml = parseSyml(lockFileContents);
  delete yarnYml.__metadata;

  const packageNodes: PackageNode[] = [];
  Object.keys(yarnYml).forEach((descriptor) => {
    const pkg = yarnYml[descriptor] as FirstLevelDependency;
    const packageName = getPackageNameFromDescriptor(descriptor);

    if (packages.includes(packageName)) {
      const packageNode = {
        name: packageName,
        version: pkg.version,
        dependencies: []
      };
      packageNodes.push(packageNode);
    } else if (pkg.dependencies) {
      const packageNode: PackageNode = {
        name: packageName,
        version: pkg.version,
        dependencies: []
      };

      Object.keys(pkg.dependencies).forEach((depName) => {
        if (packages.includes(depName)) {
          const depNode: PackageNode = {
            name: depName,
            version: pkg.dependencies![depName],
            dependencies: []
          };
          packageNode.dependencies!.push(depNode);
        }
      });

      if (packageNode.dependencies!.length > 0) {
        packageNodes.push(packageNode);
      }
    }
  });

  return packageNodes;
}

function getPackageNameFromDescriptor(descriptor: string): string {
  // example: signal-exit@npm:^3.0.0, signal-exit@npm:^3.0.2
  // example: @types/node@npm:^16.0.0, @types/node@npm:^18.0.0
  const firstDescriptor = descriptor.split(',')[0];

  return firstDescriptor.startsWith('@')
    ? firstDescriptor.slice(0, firstDescriptor.indexOf('@', 1))
    : firstDescriptor.split('@')[0];
}
