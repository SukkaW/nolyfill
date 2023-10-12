import fsp from 'fs/promises';
import detectIndent from 'detect-indent';
import path from 'path';

import type { PKG, PackageNode } from '../types';
import type { PackageManager } from '../package-manager';

async function readJSON<T>(filepath: string): Promise<T | null> {
  try {
    return JSON.parse(await fsp.readFile(filepath, 'utf-8')) as T;
  } catch {
    return null;
  }
}

async function writeJSON(filepath: string, data: unknown) {
  const original = await fsp.readFile(filepath, 'utf-8');
  const fileIndent = detectIndent(original).indent || '  ';

  return fsp.writeFile(filepath, `${JSON.stringify(data, null, fileIndent)}\n`, 'utf-8');
}

export const overridesPackageJson = async (packageManager: PackageManager, projectPath: string, packages: PackageNode[]) => {
  const overrides = Object.fromEntries(packages.map((node) => [
    node.name,
    `npm:@nolyfill/${node.name}@latest`
  ]));
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await readJSON<PKG>(packageJsonPath);
  if (!packageJson) return;

  // https://pnpm.io/package_json#pnpmoverrides
  if (packageManager === 'pnpm') {
    if (!packageJson.pnpm) packageJson.pnpm = {};
    packageJson.pnpm.overrides = {
      ...packageJson.pnpm.overrides,
      ...overrides
    };
    // https://yarnpkg.com/configuration/manifest/#resolutions
  } else if (packageManager === 'yarn') {
    if (!packageJson.resolutions) packageJson.resolutions = {};
    packageJson.resolutions = {
      ...packageJson.resolutions,
      ...overrides
    };
  } else {
    packageJson.overrides = {
      ...packageJson.overrides,
      ...overrides
    };
  }

  return writeJSON(packageJsonPath, packageJson);
};
