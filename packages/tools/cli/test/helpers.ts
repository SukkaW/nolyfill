import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const fixturesDir = path.join(__dirname, 'fixtures');

export const fixture = (name: string) => path.join(fixturesDir, name);

/** Copy a fixture into a fresh temporary directory so that tests can modify it */
export async function copyFixture(name: string): Promise<string> {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), `nolyfill-${name}-`));
  await fsp.cp(fixture(name), dir, { recursive: true });
  return dir;
}

/** loosely typed package.json for assertions */
export interface ManifestLike {
  dependencies?: Record<string, string>,
  devDependencies?: Record<string, string>,
  overrides?: Record<string, string>,
  resolutions?: Record<string, string>,
  pnpm?: Record<string, unknown> & { overrides?: Record<string, string> }
}

export async function readJSONFile<T = ManifestLike>(filePath: string): Promise<T> {
  return JSON.parse(await fsp.readFile(filePath, 'utf-8')) as T;
}

export const readTextFile = (filePath: string) => fsp.readFile(filePath, 'utf-8');

export { fileExists as exists } from '@nolyfill/internal';
