import type { PackageJson } from 'type-fest';

export interface VirtualPackage {
  path: string,
  files: Record<string, string>,
  packageJson: PackageJson
}
