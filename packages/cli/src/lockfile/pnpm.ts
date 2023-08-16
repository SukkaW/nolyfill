import { searchForPackages } from '@pnpm/list';
import type { PackageNode } from './types';

export async function searchPackagesFromPNPM(dirPath: string, packages: string[]): Promise<PackageNode[]> {
  const result = await searchForPackages(packages, [dirPath], {
    depth: Infinity,
    lockfileDir: dirPath,
    include: {
      dependencies: true,
      devDependencies: true,
      optionalDependencies: false
    }
  });

  return result.flatMap((dep) => {
    return [...(dep.dependencies ?? []), ...(dep.devDependencies ?? [])];
  });
}
