import fsp from 'node:fs/promises';
import path from 'node:path';

import { readWantedLockfile } from '@pnpm/lockfile.fs';
import { nameVerFromPkgSnapshot } from '@pnpm/lockfile.utils';
import { refToRelative } from '@pnpm/dependency-path';
import type { PackageSnapshot } from '@pnpm/lockfile.types';

import { readWantedLockfile as readWantedLockfileOld } from '@pnpm/lockfile-file--old';
import { nameVerFromPkgSnapshot as nameVerFromPkgSnapshotOld } from '@pnpm/lockfile-utils--old';
import { refToRelative as refToRelativeOld } from '@pnpm/dependency-path--old';

import type { PackageNode } from '../types';
import { cache } from '../lib/cache';
import { createNodeRegistry, mergeDependencyMaps } from './graph';

/** the parts of pnpm's lockfile object model that are common to every lockfile version */
interface LockfileSnapshot {
  dependencies?: Record<string, string>,
  optionalDependencies?: Record<string, string>
}

interface Lockfile {
  lockfileVersion: string | number,
  importers: Record<string, LockfileSnapshot & { devDependencies?: Record<string, string> }>,
  packages?: Record<string, LockfileSnapshot | undefined>
}

/**
 * pnpm's lockfile libraries only understand the lockfile formats of their own major version:
 * - the pnpm 8 era packages read lockfile v5 (pnpm 6, 7) and v6 (pnpm 8)
 * - the current packages read lockfile v9 (pnpm 9+), including the multi-document lockfiles written by pnpm 11+
 */
interface PnpmLockfileReader {
  readWantedLockfile(dir: string): Promise<Lockfile | null>,
  /** convert the reference of a `dependencies` entry (`alias: reference`) into the key of the `packages` map */
  refToRelative(reference: string, alias: string): string | null,
  nameVerFromPkgSnapshot(depPath: string, snapshot: LockfileSnapshot): { name: string, version: string }
}

const currentReader: PnpmLockfileReader = {
  readWantedLockfile: dir => readWantedLockfile(dir, { ignoreIncompatible: false }) as Promise<Lockfile | null>,
  refToRelative,
  nameVerFromPkgSnapshot: (depPath, snapshot) => nameVerFromPkgSnapshot(depPath, snapshot as PackageSnapshot)
};

const legacyReader: PnpmLockfileReader = {
  readWantedLockfile: dir => readWantedLockfileOld(dir, { ignoreIncompatible: false }),
  refToRelative: refToRelativeOld,
  nameVerFromPkgSnapshot: (depPath, snapshot) => nameVerFromPkgSnapshotOld(depPath, snapshot as Parameters<typeof nameVerFromPkgSnapshotOld>[1])
};

const rLockfileVersion = /^lockfileVersion: ["']?(\d+(?:\.\d+)?)["']?$/m;

/** e.g. `5.4`, `6`, `9` */
export const getPnpmLockfileVersion = cache(async (dirPath: string): Promise<number> => {
  const lockfilePath = path.join(dirPath, 'pnpm-lock.yaml');
  let content: string;
  try {
    content = await fsp.readFile(lockfilePath, 'utf-8');
  } catch {
    throw new Error(`Can not find pnpm-lock.yaml in ${dirPath}, please run "pnpm install" first`);
  }

  const match = rLockfileVersion.exec(content);
  if (!match) {
    throw new TypeError(`Can not detect the lockfile version of ${lockfilePath}`);
  }
  return Number.parseFloat(match[1]);
});

export const buildPNPMDepTree = cache(async (dirPath: string): Promise<PackageNode[]> => {
  const lockfileVersion = await getPnpmLockfileVersion(dirPath);
  const reader = lockfileVersion < 9 ? legacyReader : currentReader;

  const lockfile = await reader.readWantedLockfile(dirPath);
  if (!lockfile) {
    throw new Error(`Can not find pnpm-lock.yaml in ${dirPath}, please run "pnpm install" first`);
  }

  return buildGraph(lockfile, reader);
});

function buildGraph(lockfile: Lockfile, reader: PnpmLockfileReader): PackageNode[] {
  const packages = lockfile.packages || {};
  const registry = createNodeRegistry<string>();

  const getNode = (depPath: string): PackageNode | null => {
    const existing = registry.get(depPath);
    if (existing) return existing;

    const snapshot = packages[depPath];
    if (!snapshot) return null;

    const { name, version } = reader.nameVerFromPkgSnapshot(depPath, snapshot);
    const node = registry.create(depPath, name, version);

    const deps = mergeDependencyMaps(snapshot.dependencies, snapshot.optionalDependencies);
    for (let i = 0, len = deps.length; i < len; i++) {
      const childDepPath = reader.refToRelative(deps[i][1], deps[i][0]);
      const child = childDepPath && getNode(childDepPath);
      if (child) node.dependencies!.push(child);
    }

    return node;
  };

  const result: PackageNode[] = [];

  // the project and each of its workspace packages is an importer
  const importerIds = Object.keys(lockfile.importers);
  for (let i = 0, len = importerIds.length; i < len; i++) {
    const importer = lockfile.importers[importerIds[i]];
    const deps = mergeDependencyMaps(importer.dependencies, importer.devDependencies, importer.optionalDependencies);
    for (let j = 0, l = deps.length; j < l; j++) {
      // `link:` references (workspace packages) have no dep path
      const depPath = reader.refToRelative(deps[j][1], deps[j][0]);
      const node = depPath && getNode(depPath);
      if (node) result.push(node);
    }
  }

  return result;
}
