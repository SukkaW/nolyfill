import path from 'node:path';
import { isObjectEmpty } from 'foxts/is-object-empty';
import { readWorkspaceManifest } from '@pnpm/workspace.read-manifest';
import type { WorkspaceManifest } from '@pnpm/workspace.read-manifest';
import { updateWorkspaceManifest } from '@pnpm/workspace.manifest-writer';

import type { PKG, PackageNode } from './types';
import type { PackageManager } from './package-manager';
import { getPackageManagerMajorVersion } from './package-manager';
import { getPnpmLockfileVersion } from './lockfile/pnpm';
import { readJSON, writeJSON } from './lib/json';

const PRIMARY_NOLYFILL_VERSION = '^1';

export const getNolyfillOverrideSpec = (packageName: string) => `npm:@nolyfill/${packageName}@${PRIMARY_NOLYFILL_VERSION}`;

export interface OverridesOptions {
  /**
   * Major version of the package manager that is going to install the project, used to pick
   * where pnpm overrides are written. Detected from the project (`packageManager` field,
   * `devEngines`) or the `pnpm` binary when omitted.
   */
  packageManagerMajorVersion?: number | null
}

export type PnpmOverridesTarget = 'package.json' | 'pnpm-workspace.yaml';

export interface OverridesResult {
  /** absolute path of the file the overrides have been written to */
  overridesFile: string,
  /** direct dependencies of the root package.json whose spec has been replaced with the nolyfill package */
  updatedDirectDependencies: string[],
  /** `true` when the existing `pnpm.overrides` of package.json have been moved into pnpm-workspace.yaml */
  migratedFromPackageJson: boolean
}

/** Legacy nolyfill overrides used `@latest`, pin them to the current major instead */
function transformOldOverrides(overrides: Record<string, unknown> | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!overrides) return result;

  const keys = Object.keys(overrides);
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    const value = overrides[key];
    if (typeof value !== 'string') continue;
    result[key] = value.startsWith('npm:@nolyfill/') && value.endsWith('@latest')
      ? `${value.slice(0, value.lastIndexOf('@latest'))}@${PRIMARY_NOLYFILL_VERSION}`
      : value;
  }
  return result;
}

/**
 * npm refuses an override for a package that is also a direct dependency unless both share
 * the exact same spec, and yarn's "resolutions" only apply to nested dependencies. Point the
 * direct dependencies to the nolyfill package as well.
 */
function updateDirectDependencies(packageJson: PKG, overrides: Record<string, string>): string[] {
  const updated: string[] = [];
  const fields = ['dependencies', 'devDependencies', 'optionalDependencies'] as const;

  for (let i = 0, len = fields.length; i < len; i++) {
    const deps = packageJson[fields[i]];
    if (!deps) continue;
    const names = Object.keys(deps);
    for (let j = 0, l = names.length; j < l; j++) {
      const name = names[j];
      if (name in overrides && deps[name] !== overrides[name]) {
        deps[name] = overrides[name];
        updated.push(name);
      }
    }
  }

  return updated;
}

/**
 * - pnpm <= 9 only reads `pnpm.overrides` from package.json
 * - pnpm 10 reads both package.json and pnpm-workspace.yaml
 * - pnpm >= 11 only reads pnpm-workspace.yaml
 */
async function decidePnpmOverridesTarget(
  projectPath: string,
  packageJson: PKG,
  workspaceManifest: WorkspaceManifest | undefined,
  majorVersion: number | null
): Promise<PnpmOverridesTarget> {
  // overrides already live in pnpm-workspace.yaml, keep them together
  if (workspaceManifest?.overrides) return 'pnpm-workspace.yaml';

  const packageJsonHasOverrides = packageJson.pnpm?.overrides != null;

  if (majorVersion !== null) {
    if (majorVersion >= 11) return 'pnpm-workspace.yaml';
    if (majorVersion <= 9) return 'package.json';
    // pnpm 10 reads both, don't spread settings across two files
    return (workspaceManifest && !packageJsonHasOverrides) ? 'pnpm-workspace.yaml' : 'package.json';
  }

  // unknown pnpm version
  if (packageJsonHasOverrides) return 'package.json';
  // lockfile v5 (pnpm 6 / 7) and v6 (pnpm 8) can't have been produced by a pnpm that reads pnpm-workspace.yaml settings
  const lockfileVersion = await getPnpmLockfileVersion(projectPath).catch(() => null);
  if (lockfileVersion !== null && lockfileVersion < 9) return 'package.json';
  return workspaceManifest ? 'pnpm-workspace.yaml' : 'package.json';
}

export async function overridesPackageJson(
  packageManager: PackageManager,
  projectPath: string,
  packages: PackageNode[],
  options: OverridesOptions = {}
): Promise<OverridesResult> {
  const newOverrides: Record<string, string> = {};
  for (let i = 0, len = packages.length; i < len; i++) {
    newOverrides[packages[i].name] = getNolyfillOverrideSpec(packages[i].name);
  }

  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await readJSON<PKG>(packageJsonPath);
  if (!packageJson) {
    throw new Error(`Can not read ${packageJsonPath}`);
  }

  const result: OverridesResult = {
    overridesFile: packageJsonPath,
    updatedDirectDependencies: [],
    migratedFromPackageJson: false
  };

  switch (packageManager) {
    // https://pnpm.io/settings#overrides
    case 'pnpm': {
      const workspaceManifest = await readWorkspaceManifest(projectPath);
      const majorVersion = options.packageManagerMajorVersion === undefined
        ? await getPackageManagerMajorVersion(projectPath, packageManager)
        : options.packageManagerMajorVersion;

      const target = await decidePnpmOverridesTarget(projectPath, packageJson, workspaceManifest, majorVersion);

      if (target === 'package.json') {
        packageJson.pnpm ??= {};
        packageJson.pnpm.overrides = {
          ...transformOldOverrides(packageJson.pnpm.overrides),
          ...newOverrides
        };
        await writeJSON(packageJsonPath, packageJson);
        break;
      }

      // pnpm's own writer keeps the comments and formatting of pnpm-workspace.yaml, and creates it when missing
      const legacyOverrides = packageJson.pnpm?.overrides;
      await updateWorkspaceManifest(projectPath, {
        updatedOverrides: {
          ...transformOldOverrides(workspaceManifest?.overrides),
          // pnpm >= 11 ignores package.json#pnpm, move the existing overrides over
          ...transformOldOverrides(legacyOverrides),
          ...newOverrides
        }
      });
      result.overridesFile = path.join(projectPath, 'pnpm-workspace.yaml');

      if (legacyOverrides && packageJson.pnpm) {
        delete packageJson.pnpm.overrides;
        if (isObjectEmpty(packageJson.pnpm)) {
          delete packageJson.pnpm;
        }
        await writeJSON(packageJsonPath, packageJson);
        result.migratedFromPackageJson = true;
      }
      break;
    }
    // https://yarnpkg.com/configuration/manifest#resolutions
    // https://classic.yarnpkg.com/en/docs/selective-version-resolutions
    case 'yarn': {
      packageJson.resolutions = {
        ...transformOldOverrides(packageJson.resolutions),
        ...newOverrides
      };
      result.updatedDirectDependencies = updateDirectDependencies(packageJson, newOverrides);
      await writeJSON(packageJsonPath, packageJson);
      break;
    }
    // https://docs.npmjs.com/cli/configuring-npm/package-json#overrides
    // https://bun.sh/docs/install/overrides
    default: {
      packageJson.overrides = {
        ...transformOldOverrides(packageJson.overrides),
        ...newOverrides
      };
      result.updatedDirectDependencies = updateDirectDependencies(packageJson, newOverrides);
      await writeJSON(packageJsonPath, packageJson);
      break;
    }
  }

  return result;
}
