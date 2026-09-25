import fsp from 'node:fs/promises';
import path from 'node:path';
import { parseSyml } from '@yarnpkg/parsers';
import mapWorkspaces from '@npmcli/map-workspaces';
import { appendArrayInPlace } from 'foxts/append-array-in-place';

import type { PackageNode, PKG } from '../types';
import { cache } from '../lib/cache';
import { readJSON } from '../lib/json';
import { createNodeRegistry, mergeDependencyMaps } from './graph';

interface YarnLockfileEntry {
  version?: string,
  /** yarn classic: tarball URL, e.g. `https://registry.yarnpkg.com/@nolyfill/has/-/has-1.0.44.tgz#sha1` */
  resolved?: string,
  /** yarn berry: locator, e.g. `@nolyfill/has@npm:1.0.44` or `foo@workspace:packages/foo` */
  resolution?: string,
  dependencies?: Record<string, string>,
  optionalDependencies?: Record<string, string>
}

/** descriptor (`name@range`) -> lockfile entry, entries with several descriptors are shared */
type YarnLockfileEntries = Map<string, YarnLockfileEntry>;

export const buildYarnDepTree = cache(async (dirPath: string): Promise<PackageNode[]> => {
  let content: string;
  try {
    content = await fsp.readFile(path.join(dirPath, 'yarn.lock'), 'utf-8');
  } catch {
    throw new Error(`Can not find yarn.lock in ${dirPath}, please run "yarn install" first`);
  }

  return buildYarnDepTreeFromLockfile(dirPath, content);
});

/** `content` is the yarn.lock, the manifests in `dirPath` are the entry points of a classic lockfile */
export function buildYarnDepTreeFromLockfile(dirPath: string, content: string): Promise<PackageNode[]> {
  // yarn's own parser handles both the classic (v1) and the berry (v2+) lockfile syntax
  const lockfile = parseSyml(content) as Record<string, YarnLockfileEntry | undefined>;
  const isBerry = '__metadata' in lockfile;
  delete lockfile.__metadata;

  const entries: YarnLockfileEntries = new Map();
  const keys = Object.keys(lockfile);
  for (let i = 0, len = keys.length; i < len; i++) {
    const entry = lockfile[keys[i]];
    if (!entry) continue;
    // berry keeps the descriptors resolved to the same package in one key: "has@npm:^1.0.3, has@npm:^1.0.4"
    const descriptors = keys[i].split(',');
    for (let j = 0, l = descriptors.length; j < l; j++) {
      entries.set(descriptors[j].trim(), entry);
    }
  }

  return isBerry
    ? Promise.resolve(buildFromBerryLockfile(entries))
    : buildFromClassicLockfile(dirPath, entries);
}

/** `has@^1.0.4` -> `has`, `@types/node@npm:^18.0.0` -> `@types/node` */
function getPackageNameFromDescriptor(descriptor: string): string {
  const index = descriptor.indexOf('@', 1);
  return index === -1 ? descriptor : descriptor.slice(0, index);
}

/**
 * After "resolutions", the package name of the descriptor remains the original one while the
 * entry points to the nolyfill package, either through the tarball URL (classic) or the locator (berry).
 */
function getRealPackageName(descriptorName: string, entry: YarnLockfileEntry): string {
  const nolyfillName = `@nolyfill/${descriptorName}`;
  if (
    entry.resolved?.includes(`/${nolyfillName}/-/`)
    || entry.resolution?.startsWith(`${nolyfillName}@`)
  ) {
    return nolyfillName;
  }
  return descriptorName;
}

function createGraph(entries: YarnLockfileEntries) {
  const registry = createNodeRegistry<YarnLockfileEntry>();

  // fallback for descriptors that can't be found as-is (the key of an entry rewritten by "resolutions" is the resolution itself)
  const entryByName = new Map<string, YarnLockfileEntry>();
  for (const [descriptor, entry] of entries) {
    const name = getPackageNameFromDescriptor(descriptor);
    if (!entryByName.has(name)) entryByName.set(name, entry);
  }

  const findEntry = (name: string, range: string) => entries.get(`${name}@${range}`) || entryByName.get(name);

  const getNode = (descriptorName: string, entry: YarnLockfileEntry): PackageNode => {
    const existing = registry.get(entry);
    if (existing) return existing;

    const node = registry.create(entry, getRealPackageName(descriptorName, entry), entry.version || '0.0.0');

    const deps = mergeDependencyMaps(entry.dependencies, entry.optionalDependencies);
    for (let i = 0, len = deps.length; i < len; i++) {
      const [depName, range] = deps[i];
      const depEntry = findEntry(depName, range);
      if (depEntry) node.dependencies!.push(getNode(depName, depEntry));
    }

    return node;
  };

  return { findEntry, getNode };
}

function buildFromBerryLockfile(entries: YarnLockfileEntries): PackageNode[] {
  const { getNode } = createGraph(entries);

  // the project and its workspace packages are part of the lockfile
  const result: PackageNode[] = [];
  const seen = new Set<YarnLockfileEntry>();
  for (const [descriptor, entry] of entries) {
    if (seen.has(entry) || !entry.resolution?.includes('@workspace:')) continue;
    seen.add(entry);
    appendArrayInPlace(result, getNode(getPackageNameFromDescriptor(descriptor), entry).dependencies!);
  }
  return result;
}

async function buildFromClassicLockfile(dirPath: string, entries: YarnLockfileEntries): Promise<PackageNode[]> {
  const { findEntry, getNode } = createGraph(entries);

  // yarn classic doesn't record the project itself, the manifests are the entry points
  const rootManifest = await readJSON<PKG>(path.join(dirPath, 'package.json'));
  if (!rootManifest) {
    throw new Error(`Can not read package.json in ${dirPath}`);
  }
  const manifests = [rootManifest];
  if (rootManifest.workspaces) {
    // yarn workspaces follow the same `workspaces` field as npm
    const workspaces = await mapWorkspaces({ cwd: dirPath, pkg: rootManifest });
    appendArrayInPlace(
      manifests,
      (await Promise.all(Array.from(workspaces.values(), dir => readJSON<PKG>(path.join(dir, 'package.json'))))).filter((manifest): manifest is PKG => manifest !== null)
    );
  }

  const result: PackageNode[] = [];
  const seen = new Set<YarnLockfileEntry>();
  for (let i = 0, len = manifests.length; i < len; i++) {
    const manifest = manifests[i];
    const deps = mergeDependencyMaps(manifest.dependencies, manifest.devDependencies, manifest.optionalDependencies);
    for (let j = 0, l = deps.length; j < l; j++) {
      const [depName, range] = deps[j];
      const entry = findEntry(depName, range);
      if (entry && !seen.has(entry)) {
        seen.add(entry);
        result.push(getNode(depName, entry));
      }
    }
  }
  return result;
}
