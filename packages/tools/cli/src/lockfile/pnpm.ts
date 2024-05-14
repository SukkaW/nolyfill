import { searchForPackages } from '@pnpm/list';
import { searchForPackages as searchForPackages_Old } from '@pnpm/list--old';
import type { PackageNode } from '../types';
import path from 'path';
import { fileExists } from '@nolyfill/internal';
import { findWorkspacePackagesNoCheck } from '@pnpm/workspace.find-packages';
import { cache } from '../lib/cache';
import { getPNPMLockfileVersion } from '.';

export const buildPNPMDepTree = cache(async (dirPath: string): Promise<PackageNode[]> => {
  const dirPaths = [dirPath];

  if (await fileExists(path.join(dirPath, 'pnpm-workspace.yaml'))) {
    const allProjects = await findWorkspacePackagesNoCheck(dirPath);
    dirPaths.push(...allProjects.map((project) => project.dir));
  }

  const searchNew = () => searchForPackages(['*'], dirPaths, {
    depth: Infinity,
    lockfileDir: dirPath,
    include: {
      dependencies: true,
      devDependencies: true,
      optionalDependencies: false
    },
    virtualStoreDirMaxLength: Infinity
  })

  const searchOld = () => searchForPackages_Old(['*'], dirPaths, {
    depth: Infinity,
    lockfileDir: dirPath,
    include: {
      dependencies: true,
      devDependencies: true,
      optionalDependencies: false
    },
  })

  const lockfileVersion = await getPNPMLockfileVersion(dirPath)

  const result = await ((+lockfileVersion) < 6 ? searchOld() : searchNew())

  return result.flatMap((dep) => {
    return [...(dep.dependencies ?? []), ...(dep.devDependencies ?? [])];
  });
});
