import fsp from 'fs/promises';
import detectIndent from 'detect-indent';
import path from 'path';

import type { PKG, PackageNode } from '../types';
import type { PackageManager } from '../package-manager';

const PRIMARY_NOLYFILL_VERSION = '^1';

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

const transformOldOverrides = (overrides: Record<string, string> | undefined) => {
  if (!overrides) return;
  return Object.entries(overrides).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value.startsWith('npm:@nolyfill/') && value.endsWith('@latest')) {
      acc[key] = `${value.slice(0, value.lastIndexOf('@latest'))}@${PRIMARY_NOLYFILL_VERSION}`;
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export const overridesPackageJson = async (packageManager: PackageManager, projectPath: string, packages: PackageNode[]) => {
  const newOverrides = packages.reduce<Record<string, string>>((acc, cur) => {
    acc[cur.name] = `npm:@nolyfill/${cur.name}@${PRIMARY_NOLYFILL_VERSION}`;
    return acc;
  }, {});

  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await readJSON<PKG>(packageJsonPath);
  if (!packageJson) return;

  // https://pnpm.io/package_json#pnpmoverrides
  if (packageManager === 'pnpm') {
    if (!packageJson.pnpm) packageJson.pnpm = {};
    packageJson.pnpm.overrides = {
      ...transformOldOverrides(packageJson.pnpm.overrides),
      ...newOverrides
    };
    // https://yarnpkg.com/configuration/manifest/#resolutions
  } else if (packageManager === 'yarn') {
    if (!packageJson.resolutions) packageJson.resolutions = {};
    packageJson.resolutions = {
      ...transformOldOverrides(packageJson.resolutions),
      ...newOverrides
    };
  } else {
    packageJson.overrides = {
      ...transformOldOverrides(packageJson.overrides),
      ...newOverrides
    };
  }

  return writeJSON(packageJsonPath, packageJson);
};
