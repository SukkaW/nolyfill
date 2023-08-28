import { searchForPackages } from '@pnpm/list';
import type { PackageNode } from '../types';
import path from 'path';
import { fileExists } from '@nolyfill/internal';
import { findWorkspacePackagesNoCheck } from '@pnpm/workspace.find-packages';
import { cache } from '../lib/cache';

export const buildPNPMDepTree = cache(async (dirPath: string): Promise<PackageNode[]> => {
  const dirPaths = [dirPath];

  if (await fileExists(path.join(dirPath, 'pnpm-workspace.yaml'))) {
    const allProjects = await findWorkspacePackagesNoCheck(dirPath);
    dirPaths.push(...allProjects.map((project) => project.dir));
  }

  const result = await searchForPackages(['*'], dirPaths, {
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
});
