import type { PackageJson } from 'type-fest';

export interface PackageNode {
  name: string,
  version: string,
  dependencies?: PackageNode[]
}

export type PKG = PackageJson & {
  version: string,
  overrides?: Record<string, string>,
  resolutions?: Record<string, string>,
  pnpm?: {
    overrides?: Record<string, string>
  }
};
