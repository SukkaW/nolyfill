import { searchForPackages } from '@pnpm/list';
import type { PackageNode } from './types';
import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { parseSyml } from '@yarnpkg/parsers';
import fastGlob from 'fast-glob';

export async function searchPackagesFromPNPM(dirPath: string, packages: string[]): Promise<PackageNode[]> {
  const dirPaths = [dirPath];

  const pnpmWorkspacePath = path.join(dirPath, 'pnpm-workspace.yaml');
  if (fs.existsSync(pnpmWorkspacePath)) {
    const pnpmWorkspaceContent = await fsp.readFile(pnpmWorkspacePath, 'utf-8');
    const pnpmWorkspaceYaml = parseSyml(pnpmWorkspaceContent) as { packages?: string[] };
    if (pnpmWorkspaceYaml.packages) {
      const workspaceDirPaths = await fastGlob(pnpmWorkspaceYaml.packages, {
        cwd: dirPath,
        onlyDirectories: true,
        absolute: true
      });
      dirPaths.push(...workspaceDirPaths);
    }
  }

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
