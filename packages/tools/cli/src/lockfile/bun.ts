import fsp from 'node:fs/promises';
import path from 'node:path';
import { parse as parseBunLockfile } from 'lockparse';
import type { ParsedDependency, PackageJsonLike } from 'lockparse';
import { parse as parseBinaryLockfile } from '@hyrious/bun.lockb';
import mapWorkspaces from '@npmcli/map-workspaces';
import { fileExists } from '@nolyfill/internal';

import type { PackageNode, PKG } from '../types';
import { cache } from '../lib/cache';
import { readJSON } from '../lib/json';
import { createNodeRegistry, mergeDependencyMaps } from './graph';
import { buildYarnDepTreeFromLockfile } from './yarn';

export const buildBunDepTree = cache(async (dirPath: string): Promise<PackageNode[]> => {
  // bun prefers the text lockfile when both exist
  const textLockfilePath = path.join(dirPath, 'bun.lock');
  if (await fileExists(textLockfilePath)) {
    return buildFromTextLockfile(dirPath, await fsp.readFile(textLockfilePath, 'utf-8'));
  }

  const binaryLockfilePath = path.join(dirPath, 'bun.lockb');
  if (await fileExists(binaryLockfilePath)) {
    // The binary lockfile (bun < 1.2) is converted to the yarn v1 format, exactly like `bun bun.lockb` prints it
    return buildYarnDepTreeFromLockfile(dirPath, parseBinaryLockfile(await fsp.readFile(binaryLockfilePath)));
  }

  throw new Error(`Can not find bun.lock in ${dirPath}, please run "bun install" first`);
});

async function buildFromTextLockfile(dirPath: string, content: string): Promise<PackageNode[]> {
  const rootManifest = await readJSON<PKG>(path.join(dirPath, 'package.json'));
  if (!rootManifest) {
    throw new Error(`Can not read package.json in ${dirPath}`);
  }

  const lockfile = await parseBunLockfile(content, 'bun.lock', rootManifest);

  const registry = createNodeRegistry<ParsedDependency>();
  const getNode = (dep: ParsedDependency): PackageNode => {
    const existing = registry.get(dep);
    if (existing) return existing;

    // aliased / overridden packages are named after the package they resolve to
    const node = registry.create(dep, dep.name, dep.version);
    const children = [...dep.dependencies, ...dep.optionalDependencies, ...dep.peerDependencies];
    for (let i = 0, len = children.length; i < len; i++) {
      node.dependencies!.push(getNode(children[i]));
    }
    return node;
  };

  const result: PackageNode[] = [];
  const rootDeps = [...lockfile.root.dependencies, ...lockfile.root.devDependencies, ...lockfile.root.optionalDependencies];
  for (let i = 0, len = rootDeps.length; i < len; i++) {
    result.push(getNode(rootDeps[i]));
  }

  // lockparse only resolves the dependencies of the root workspace, the other workspace packages
  // (bun uses the same `workspaces` field as npm) are resolved from their manifests against the flat package list
  if (rootManifest.workspaces) {
    const packagesByName = new Map<string, ParsedDependency>();
    for (let i = 0, len = lockfile.packages.length; i < len; i++) {
      const pkg = lockfile.packages[i];
      if (!packagesByName.has(pkg.name)) packagesByName.set(pkg.name, pkg);
    }

    const workspaces = await mapWorkspaces({ cwd: dirPath, pkg: rootManifest });
    const manifests = await Promise.all(Array.from(workspaces.values(), dir => readJSON<PKG>(path.join(dir, 'package.json'))));
    for (let i = 0, len = manifests.length; i < len; i++) {
      const manifest = manifests[i];
      if (!manifest) continue;
      const deps = mergeDependencyMaps(manifest.dependencies, manifest.devDependencies, manifest.optionalDependencies);
      for (let j = 0, l = deps.length; j < l; j++) {
        const dep = packagesByName.get(deps[j][0]);
        if (dep) result.push(getNode(dep));
      }
    }
  }

  return result;
}
