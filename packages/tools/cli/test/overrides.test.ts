import { describe, it } from 'node:test';
import { expect } from 'earl';
import fsp from 'node:fs/promises';
import path from 'node:path';

import type { PackageNode } from '../src/types';
import { overridesPackageJson } from '../src/overrides';
import { copyFixture, exists, readJSONFile, readTextFile } from './helpers';

const packages: PackageNode[] = [
  { name: 'array-includes', version: '3.2.0' },
  { name: 'is-core-module', version: '2.17.0' },
  { name: 'object.assign', version: '4.1.7' }
];

const expectedOverrides = {
  'array-includes': 'npm:@nolyfill/array-includes@^1',
  'is-core-module': 'npm:@nolyfill/is-core-module@^1',
  'object.assign': 'npm:@nolyfill/object.assign@^1'
};

describe('overridesPackageJson', () => {
  describe('npm', () => {
    it('writes "overrides" and points direct dependencies to nolyfill', async () => {
      const dir = await copyFixture('npm-single');
      const result = await overridesPackageJson('npm', dir, packages);

      const packageJson = await readJSONFile(path.join(dir, 'package.json'));
      expect(packageJson.overrides).toEqual(expectedOverrides);
      // npm rejects an override of a direct dependency unless both share the exact same spec
      expect(packageJson.dependencies!['array-includes']).toEqual('npm:@nolyfill/array-includes@^1');
      // unrelated dependencies are untouched
      expect(packageJson.dependencies!.resolve).toEqual('^1.22.10');
      expect(packageJson.devDependencies!['object.assign']).toEqual('npm:@nolyfill/object.assign@^1');

      expect(result.overridesFile).toEqual(path.join(dir, 'package.json'));
      expect(result.updatedDirectDependencies).toEqual(['array-includes', 'object.assign']);
      expect(result.migratedFromPackageJson).toEqual(false);
    });

    it('keeps existing overrides and migrates legacy "@latest" ones', async () => {
      const dir = await copyFixture('npm-single');
      const packageJsonPath = path.join(dir, 'package.json');
      const original = await readJSONFile(packageJsonPath);
      original.overrides = { has: 'npm:@nolyfill/has@latest', foo: '^1.0.0' };
      await fsp.writeFile(packageJsonPath, JSON.stringify(original, null, 4));

      await overridesPackageJson('npm', dir, packages);

      const content = await readTextFile(packageJsonPath);
      // indentation of the file is preserved
      expect(content.includes('\n    "')).toBeTruthy();
      expect(JSON.parse(content).overrides).toEqual({
        has: 'npm:@nolyfill/has@^1',
        foo: '^1.0.0',
        ...expectedOverrides
      });
    });
  });

  describe('bun', () => {
    it('writes "overrides" like npm', async () => {
      const dir = await copyFixture('bun-ws');
      const result = await overridesPackageJson('bun', dir, packages);

      const packageJson = await readJSONFile(path.join(dir, 'package.json'));
      expect(packageJson.overrides).toEqual(expectedOverrides);
      expect(packageJson.dependencies!['array-includes']).toEqual('npm:@nolyfill/array-includes@^1');
      expect(result.updatedDirectDependencies).toEqual(['array-includes', 'object.assign']);
    });
  });

  describe('yarn', () => {
    it('writes "resolutions" and points direct dependencies to nolyfill', async () => {
      const dir = await copyFixture('yarn4-ws');
      const result = await overridesPackageJson('yarn', dir, packages);

      const packageJson = await readJSONFile(path.join(dir, 'package.json'));
      expect(packageJson.resolutions).toEqual(expectedOverrides);
      expect(packageJson.dependencies!['array-includes']).toEqual('npm:@nolyfill/array-includes@^1');
      expect(result.updatedDirectDependencies).toEqual(['array-includes', 'object.assign']);
      expect(packageJson.overrides).toEqual(undefined);
    });
  });

  describe('pnpm', () => {
    it('pnpm <= 9 writes "pnpm.overrides" to package.json', async () => {
      const dir = await copyFixture('pnpm8-ws');
      const workspaceYamlBefore = await readTextFile(path.join(dir, 'pnpm-workspace.yaml'));

      for (let majorVersion = 7; majorVersion <= 9; majorVersion++) {
        const result = await overridesPackageJson('pnpm', dir, packages, { packageManagerMajorVersion: majorVersion });
        expect(result.overridesFile).toEqual(path.join(dir, 'package.json'));
      }

      const packageJson = await readJSONFile(path.join(dir, 'package.json'));
      expect(packageJson.pnpm!.overrides).toEqual(expectedOverrides);
      // pnpm overrides apply to direct dependencies too
      expect(packageJson.dependencies!['array-includes']).toEqual('^3.1.8');
      expect(await readTextFile(path.join(dir, 'pnpm-workspace.yaml'))).toEqual(workspaceYamlBefore);
    });

    it('pnpm >= 11 writes "overrides" to pnpm-workspace.yaml, preserving the rest of the file', async () => {
      const dir = await copyFixture('pnpm-ws');
      const workspaceYamlPath = path.join(dir, 'pnpm-workspace.yaml');
      await fsp.writeFile(workspaceYamlPath, [
        '# workspace packages',
        'packages:',
        '  - "packages/*"',
        '',
        'allowBuilds:',
        '  "@swc/core": true # native',
        ''
      ].join('\n'));

      const result = await overridesPackageJson('pnpm', dir, packages, { packageManagerMajorVersion: 11 });
      expect(result.overridesFile).toEqual(workspaceYamlPath);
      expect(result.migratedFromPackageJson).toEqual(false);

      expect(await readTextFile(workspaceYamlPath)).toEqual([
        '# workspace packages',
        'packages:',
        '  - "packages/*"',
        '',
        'allowBuilds:',
        '  "@swc/core": true # native',
        'overrides:',
        '  array-includes: npm:@nolyfill/array-includes@^1',
        '  is-core-module: npm:@nolyfill/is-core-module@^1',
        '  object.assign: npm:@nolyfill/object.assign@^1',
        ''
      ].join('\n'));

      const packageJson = await readJSONFile(path.join(dir, 'package.json'));
      expect(packageJson.pnpm).toEqual(undefined);
    });

    it('pnpm >= 11 moves existing "pnpm.overrides" from package.json to pnpm-workspace.yaml', async () => {
      const dir = await copyFixture('pnpm-ws');
      const packageJsonPath = path.join(dir, 'package.json');
      const original = await readJSONFile(packageJsonPath);
      original.pnpm = {
        overrides: { has: 'npm:@nolyfill/has@latest', 'array-includes': '3.1.8' },
        peerDependencyRules: { ignoreMissing: ['react'] }
      };
      await fsp.writeFile(packageJsonPath, JSON.stringify(original, null, 2));

      const result = await overridesPackageJson('pnpm', dir, packages, { packageManagerMajorVersion: 12 });
      expect(result.migratedFromPackageJson).toEqual(true);

      const packageJson = await readJSONFile(packageJsonPath);
      // other pnpm settings are left in place
      expect(packageJson.pnpm).toEqual({ peerDependencyRules: { ignoreMissing: ['react'] } });

      expect(await readTextFile(path.join(dir, 'pnpm-workspace.yaml'))).toEqual([
        'packages:',
        '  - "packages/*"',
        // pnpm's writer keeps the overrides sorted
        'overrides:',
        '  array-includes: npm:@nolyfill/array-includes@^1',
        '  has: npm:@nolyfill/has@^1',
        '  is-core-module: npm:@nolyfill/is-core-module@^1',
        '  object.assign: npm:@nolyfill/object.assign@^1',
        ''
      ].join('\n'));
    });

    it('pnpm >= 11 creates pnpm-workspace.yaml for a single project', async () => {
      const dir = await copyFixture('pnpm-single');
      expect(await exists(path.join(dir, 'pnpm-workspace.yaml'))).toEqual(false);

      const result = await overridesPackageJson('pnpm', dir, packages, { packageManagerMajorVersion: 11 });
      expect(result.overridesFile).toEqual(path.join(dir, 'pnpm-workspace.yaml'));
      expect(await readTextFile(path.join(dir, 'pnpm-workspace.yaml'))).toEqual([
        'overrides:',
        '  array-includes: npm:@nolyfill/array-includes@^1',
        '  is-core-module: npm:@nolyfill/is-core-module@^1',
        '  object.assign: npm:@nolyfill/object.assign@^1',
        ''
      ].join('\n'));
    });

    it('pnpm 10 prefers the file that is already in use', async () => {
      // a workspace file exists and package.json has no pnpm settings
      let dir = await copyFixture('pnpm-ws');
      expect((await overridesPackageJson('pnpm', dir, packages, { packageManagerMajorVersion: 10 })).overridesFile).toEqual(path.join(dir, 'pnpm-workspace.yaml'));

      // no workspace file
      dir = await copyFixture('pnpm-single');
      expect((await overridesPackageJson('pnpm', dir, packages, { packageManagerMajorVersion: 10 })).overridesFile).toEqual(path.join(dir, 'package.json'));

      // package.json already has overrides
      dir = await copyFixture('pnpm-ws');
      const packageJsonPath = path.join(dir, 'package.json');
      const original = await readJSONFile(packageJsonPath);
      original.pnpm = { overrides: { foo: '1.0.0' } };
      await fsp.writeFile(packageJsonPath, JSON.stringify(original, null, 2));
      expect((await overridesPackageJson('pnpm', dir, packages, { packageManagerMajorVersion: 10 })).overridesFile).toEqual(packageJsonPath);
      expect((await readJSONFile(packageJsonPath)).pnpm!.overrides).toEqual({ foo: '1.0.0', ...expectedOverrides });
    });

    it('keeps using pnpm-workspace.yaml once overrides live there', async () => {
      const dir = await copyFixture('pnpm-ws');
      const workspaceYamlPath = path.join(dir, 'pnpm-workspace.yaml');
      await fsp.appendFile(workspaceYamlPath, 'overrides:\n  has: npm:@nolyfill/has@latest\n');

      const result = await overridesPackageJson('pnpm', dir, packages, { packageManagerMajorVersion: 9 });
      expect(result.overridesFile).toEqual(workspaceYamlPath);
      expect(await readTextFile(workspaceYamlPath)).toEqual([
        'packages:',
        '  - "packages/*"',
        // pnpm's writer keeps the overrides sorted
        'overrides:',
        '  array-includes: npm:@nolyfill/array-includes@^1',
        '  has: npm:@nolyfill/has@^1',
        '  is-core-module: npm:@nolyfill/is-core-module@^1',
        '  object.assign: npm:@nolyfill/object.assign@^1',
        ''
      ].join('\n'));
    });

    it('falls back to the lockfile version when the pnpm version is unknown', async () => {
      // lockfile v6 can only come from pnpm 8, which doesn't read pnpm-workspace.yaml settings
      let dir = await copyFixture('pnpm8-ws');
      expect((await overridesPackageJson('pnpm', dir, packages, { packageManagerMajorVersion: null })).overridesFile).toEqual(path.join(dir, 'package.json'));

      // lockfile v9 with a workspace file
      dir = await copyFixture('pnpm-ws');
      expect((await overridesPackageJson('pnpm', dir, packages, { packageManagerMajorVersion: null })).overridesFile).toEqual(path.join(dir, 'pnpm-workspace.yaml'));

      // lockfile v9 without a workspace file
      dir = await copyFixture('pnpm-single');
      expect((await overridesPackageJson('pnpm', dir, packages, { packageManagerMajorVersion: null })).overridesFile).toEqual(path.join(dir, 'package.json'));
    });
  });
});
