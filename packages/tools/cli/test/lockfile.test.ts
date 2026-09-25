import { describe, it } from 'node:test';
import { expect } from 'earl';

import type { PackageManager } from '../src/package-manager';
import type { PackageNode } from '../src/types';
import { buildDepTrees } from '../src/lockfile';
import { findPackagesCoveredByNolyfill, findPackagesNotCoveredByNolyfill } from '../src/find-coverable-packages';
import { fixture } from './helpers';

const rSemver = /^\d+\.\d+\.\d+/;

/**
 * Every fixture project depends on:
 * - `array-includes` (covered by nolyfill, brings in most of the es-shim ecosystem)
 * - `resolve` (not covered, depends on the covered `is-core-module`)
 * - `object.assign` as a devDependency (covered)
 *
 * The workspace fixtures also have a `packages/a` workspace package depending on `has` and `side-channel` (both covered).
 */
const singleProjectExpected = ['array-includes', 'is-core-module', 'object.assign'];
const workspaceExpected = ['array-includes', 'has', 'is-core-module', 'object.assign', 'side-channel'];

const cases: Array<[fixture: string, packageManager: PackageManager, expected: string[]]> = [
  ['npm6-single', 'npm', singleProjectExpected],
  ['npm-single', 'npm', singleProjectExpected],
  ['npm-ws', 'npm', workspaceExpected],
  ['pnpm7-single', 'pnpm', singleProjectExpected],
  ['pnpm8-single', 'pnpm', singleProjectExpected],
  ['pnpm8-ws', 'pnpm', workspaceExpected],
  ['pnpm9-single', 'pnpm', singleProjectExpected],
  ['pnpm10-single', 'pnpm', singleProjectExpected],
  ['pnpm-single', 'pnpm', singleProjectExpected],
  ['pnpm-ws', 'pnpm', workspaceExpected],
  ['yarn1-single', 'yarn', singleProjectExpected],
  ['yarn1-ws', 'yarn', workspaceExpected],
  ['yarn4-single', 'yarn', singleProjectExpected],
  ['yarn4-ws', 'yarn', workspaceExpected]
];

/** fixtures where `nolyfill install` and a real install have already been run */
const nolyfilledCases: Array<[fixture: string, packageManager: PackageManager]> = [
  ['npm-single-nolyfilled', 'npm'],
  ['pnpm8-ws-nolyfilled', 'pnpm'],
  ['pnpm-ws-nolyfilled', 'pnpm'],
  ['yarn1-ws-nolyfilled', 'yarn'],
  ['yarn4-ws-nolyfilled', 'yarn']
];

function collectNodes(roots: PackageNode[]) {
  const nodes = new Map<string, PackageNode[]>();
  const seen = new Set<PackageNode>();
  const visit = (node: PackageNode) => {
    if (seen.has(node)) return;
    seen.add(node);
    const list = nodes.get(node.name);
    if (list) {
      list.push(node);
    } else {
      nodes.set(node.name, [node]);
    }
    node.dependencies?.forEach(visit);
  };
  roots.forEach(visit);
  return nodes;
}

describe('dependency graph from lockfile', () => {
  for (let i = 0, len = cases.length; i < len; i++) {
    const [name, packageManager, expected] = cases[i];
    describe(name, () => {
      it('finds the packages covered by nolyfill', async () => {
        const covered = await findPackagesCoveredByNolyfill(packageManager, fixture(name));
        expect(covered.map(node => node.name)).toEqual(expected);
        for (let j = 0, l = covered.length; j < l; j++) {
          expect(covered[j].version).toMatchRegex(rSemver);
          // covered packages are reported without their dependencies
          expect(covered[j].dependencies).toBeNullish();
        }
      });

      it('finds the es-shim internals that nolyfill would leave behind', async () => {
        const notCovered = await findPackagesNotCoveredByNolyfill(packageManager, fixture(name));
        expect(notCovered.map(node => node.name)).toEqual(['call-bind', 'es-abstract', 'es-shim-unscopables', 'function-bind', 'get-intrinsic']);
      });

      it('builds a shared graph with resolved transitive dependencies', async () => {
        const roots = await buildDepTrees(packageManager, fixture(name));
        const nodes = collectNodes(roots);

        // `resolve` is not covered, its dependency `is-core-module` is
        const [resolve] = nodes.get('resolve')!;
        expect(resolve.dependencies!.map(dep => dep.name)).toInclude('is-core-module');

        // deep transitive dependency of array-includes
        const [arrayIncludes] = nodes.get('array-includes')!;
        expect(arrayIncludes.version).toEqual('3.2.0');
        const esAbstract = arrayIncludes.dependencies!.find(dep => dep.name === 'es-abstract')!;
        expect(esAbstract.dependencies!.length).toBeGreaterThan(10);

        // a package depended on from several places is a single node
        expect(nodes.get('call-bind')!).toHaveLength(1);
        expect(nodes.get('es-abstract')!).toHaveLength(1);
        expect(nodes.get('function-bind')!).toHaveLength(1);
      });
    });
  }

  for (let i = 0, len = nolyfilledCases.length; i < len; i++) {
    const [name, packageManager] = nolyfilledCases[i];
    describe(name, () => {
      it('recognizes the packages already replaced by nolyfill', async () => {
        expect(await findPackagesCoveredByNolyfill(packageManager, fixture(name))).toEqual([]);
        expect(await findPackagesNotCoveredByNolyfill(packageManager, fixture(name))).toEqual([]);

        const nodes = collectNodes(await buildDepTrees(packageManager, fixture(name)));
        // the replacement is reported under its real name
        expect(nodes.has('@nolyfill/array-includes')).toBeTruthy();
        expect(nodes.has('array-includes')).toBeFalsy();
        // the polyfill dependencies are gone
        expect(nodes.has('es-abstract')).toBeFalsy();
      });
    });
  }
});
