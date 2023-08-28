import { searchForPackages } from '@pnpm/list';
import type { PackageNode } from '../types';
import path from 'path';
import { fileExists } from '@nolyfill/internal';
import { findWorkspacePackagesNoCheck } from '@pnpm/workspace.find-packages';
import { cache } from '../lib/cache';

const getPnpmWorkspaceDirPaths = cache(async (dirPath: string) => {
  const dirPaths = [dirPath];

  if (await fileExists(path.join(dirPath, 'pnpm-workspace.yaml'))) {
    const allProjects = await findWorkspacePackagesNoCheck(dirPath);
    dirPaths.push(...allProjects.map((project) => project.dir));
  }

  return dirPaths;
});

export async function searchPackagesFromPNPM(dirPath: string, packages: string[]): Promise<PackageNode[]> {
  const dirPaths = await getPnpmWorkspaceDirPaths(dirPath);
  const result = await searchForPackages(packages, dirPaths, {
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
