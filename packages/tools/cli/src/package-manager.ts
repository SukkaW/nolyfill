import path from 'node:path';
import { detect } from 'package-manager-detector';
import { async as ezspawnAsync } from '@jsdevtools/ez-spawn';
import { fileExists } from '@nolyfill/internal';
import { split0th } from 'foxts/split-nth';
import semver from 'semver';

import type { PKG } from './types';
import { readJSON } from './lib/json';
import { cache } from './lib/cache';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export const LOCKFILES: Record<PackageManager, string[]> = {
  npm: ['package-lock.json', 'npm-shrinkwrap.json'],
  pnpm: ['pnpm-lock.yaml'],
  yarn: ['yarn.lock'],
  bun: ['bun.lock', 'bun.lockb']
};

/**
 * Detect the package manager of the project from its lockfile, `packageManager` field or
 * `devEngines.packageManager` field, looking upward from `cwd` so it also works inside a
 * workspace package.
 */
export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  const result = await detect({ cwd });

  if (!result) {
    throw new Error('Can not determine the package manager of the project (no lockfile or "packageManager" field found), please specify one with the "--pm" option');
  }
  // `name` is `agent` without the version specifier (e.g. `yarn@berry` -> `yarn`)
  if (!(result.name in LOCKFILES)) {
    throw new Error(`nolyfill does not support ${result.name}`);
  }
  return result.name as PackageManager;
}

/**
 * Find the root of the project, i.e. the directory that contains the lockfile of the package
 * manager. Overrides can only be declared there, so this also is where nolyfill will write
 * them, even when invoked from inside a workspace package.
 *
 * Returns `null` when no lockfile is found in `start` or any of its parent directories.
 */
export async function findProjectRoot(start: string, packageManager: PackageManager): Promise<string | null> {
  const lockfiles = LOCKFILES[packageManager];
  let dir = path.resolve(start);

  for (;;) {
    for (let i = 0, len = lockfiles.length; i < len; i++) {
      if (await fileExists(path.join(dir, lockfiles[i]))) {
        return dir;
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/**
 * The version of the package manager declared by the project, through the `packageManager`
 * field (`pnpm@10.1.0`) or `devEngines.packageManager` (`{ name: 'pnpm', version: '^10' }`)
 */
export function getDeclaredPackageManagerVersion(packageJson: PKG | null, packageManager: PackageManager): string | null {
  if (!packageJson) return null;

  if (typeof packageJson.packageManager === 'string' && packageJson.packageManager.startsWith(`${packageManager}@`)) {
    // strip the hash: pnpm@10.1.0+sha512.abc
    return split0th(packageJson.packageManager.slice(packageManager.length + 1), '+');
  }

  const devEngines = packageJson.devEngines?.packageManager;
  const candidates = Array.isArray(devEngines) ? devEngines : (devEngines ? [devEngines] : []);
  for (let i = 0, len = candidates.length; i < len; i++) {
    if (candidates[i].name === packageManager && candidates[i].version) {
      return candidates[i].version!;
    }
  }

  return null;
}

/**
 * The version of the package manager that will install the project: the one declared by the
 * project if any (the lowest version of the range when it is a range), otherwise the one
 * available on the PATH (which is what `pnpm install` is going to run). `null` when neither is known.
 */
export const getPackageManagerVersion = cache(async (projectPath: string, packageManager: PackageManager): Promise<string | null> => {
  const packageJson = await readJSON<PKG>(path.join(projectPath, 'package.json'));
  const declared = getDeclaredPackageManagerVersion(packageJson, packageManager);
  if (declared) {
    const minVersion = semver.minVersion(declared, true);
    if (minVersion) return minVersion.version;
  }

  try {
    const { stdout } = await ezspawnAsync(packageManager, ['--version'], { cwd: projectPath });
    return semver.coerce(stdout)?.version ?? null;
  } catch {
    return null;
  }
});

export async function getPackageManagerMajorVersion(projectPath: string, packageManager: PackageManager): Promise<number | null> {
  const version = await getPackageManagerVersion(projectPath, packageManager);
  return version === null ? null : semver.major(version);
}

/**
 * npm before 11.2.0 ignores overrides added to package.json when a package-lock.json already
 * exists, see https://github.com/npm/cli/issues/5850 (fixed by https://github.com/npm/cli/pull/8089).
 * An unknown version is assumed to be affected.
 */
export const npmIgnoresNewOverrides = (npmVersion: string | null) => npmVersion === null || semver.lt(npmVersion, '11.2.0');
