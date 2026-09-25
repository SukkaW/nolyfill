import { describe, it } from 'node:test';
import { expect } from 'earl';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { detectPackageManager, findProjectRoot, getDeclaredPackageManagerVersion, getPackageManagerVersion, npmIgnoresNewOverrides } from '../src/package-manager';
import { copyFixture, fixture, readJSONFile } from './helpers';

const rSemver = /^\d+\.\d+\.\d+$/;

describe('detectPackageManager', () => {
  it('detects the package manager from the lockfile, also from inside a workspace package', async () => {
    expect(await detectPackageManager(fixture('npm-ws'))).toEqual('npm');
    expect(await detectPackageManager(path.join(fixture('npm-ws'), 'packages/a'))).toEqual('npm');
    expect(await detectPackageManager(path.join(fixture('pnpm-ws'), 'packages/a'))).toEqual('pnpm');
    expect(await detectPackageManager(path.join(fixture('yarn1-ws'), 'packages/a'))).toEqual('yarn');
    expect(await detectPackageManager(path.join(fixture('yarn4-ws'), 'packages/a'))).toEqual('yarn');
  });
});

describe('findProjectRoot', () => {
  it('finds the directory containing the lockfile', async () => {
    expect(await findProjectRoot(fixture('pnpm-ws'), 'pnpm')).toEqual(fixture('pnpm-ws'));
    expect(await findProjectRoot(path.join(fixture('pnpm-ws'), 'packages/a'), 'pnpm')).toEqual(fixture('pnpm-ws'));
    expect(await findProjectRoot(path.join(fixture('npm-ws'), 'packages/a'), 'npm')).toEqual(fixture('npm-ws'));
    expect(await findProjectRoot(path.join(fixture('yarn4-ws'), 'packages/a'), 'yarn')).toEqual(fixture('yarn4-ws'));
  });

  it('returns null when there is no lockfile', async () => {
    const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'nolyfill-no-lockfile-'));
    expect(await findProjectRoot(dir, 'pnpm')).toEqual(null);
  });
});

describe('getDeclaredPackageManagerVersion', () => {
  it('reads the packageManager field', () => {
    expect(getDeclaredPackageManagerVersion({ version: '0.0.0', packageManager: 'pnpm@10.1.0+sha512.abc' }, 'pnpm')).toEqual('10.1.0');
    expect(getDeclaredPackageManagerVersion({ version: '0.0.0', packageManager: 'yarn@4.9.2' }, 'pnpm')).toEqual(null);
  });

  it('reads devEngines.packageManager', () => {
    expect(getDeclaredPackageManagerVersion({ version: '0.0.0', devEngines: { packageManager: { name: 'pnpm', version: '^11.0.0' } } }, 'pnpm')).toEqual('^11.0.0');
    expect(getDeclaredPackageManagerVersion({ version: '0.0.0', devEngines: { packageManager: [{ name: 'npm', version: '11' }, { name: 'pnpm', version: '9' }] } }, 'pnpm')).toEqual('9');
    expect(getDeclaredPackageManagerVersion({ version: '0.0.0' }, 'pnpm')).toEqual(null);
    expect(getDeclaredPackageManagerVersion(null, 'pnpm')).toEqual(null);
  });
});

describe('getPackageManagerVersion', () => {
  it('uses the version declared by the project', async () => {
    // yarn4-single declares "packageManager": "yarn@4.9.2"
    expect(await getPackageManagerVersion(fixture('yarn4-single'), 'yarn')).toEqual('4.9.2');
    expect(await getPackageManagerVersion(fixture('pnpm8-ws'), 'pnpm')).toEqual('8.15.9');
  });

  it('uses the lowest version of a declared range', async () => {
    const dir = await copyFixture('npm-single');
    const packageJsonPath = path.join(dir, 'package.json');
    const packageJson = await readJSONFile<Record<string, unknown>>(packageJsonPath);
    packageJson.devEngines = { packageManager: { name: 'npm', version: '^10.5.0' } };
    await fsp.writeFile(packageJsonPath, JSON.stringify(packageJson));

    expect(await getPackageManagerVersion(dir, 'npm')).toEqual('10.5.0');
  });

  it('falls back to the binary on the PATH', async () => {
    // npm-single doesn't declare a package manager
    expect((await getPackageManagerVersion(fixture('npm-single'), 'npm'))!).toMatchRegex(rSemver);
  });
});

describe('npmIgnoresNewOverrides', () => {
  it('is only fixed since npm 11.2.0', () => {
    expect(npmIgnoresNewOverrides('10.9.0')).toBeTruthy();
    expect(npmIgnoresNewOverrides('11.1.0')).toBeTruthy();
    expect(npmIgnoresNewOverrides('11.2.0')).toBeFalsy();
    expect(npmIgnoresNewOverrides('12.1.0')).toBeFalsy();
    // unknown version: assume the worst
    expect(npmIgnoresNewOverrides(null)).toBeTruthy();
  });
});
