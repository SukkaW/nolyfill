import { detect } from 'package-manager-detector';
import type { DetectResult } from 'package-manager-detector';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export function tramsformPackageManager(input: DetectResult | null): PackageManager {
  // `name` is `agent` without the version specifier (e.g. `yarn@berry` -> `yarn`)
  if (input) return input.name as PackageManager;

  throw new Error('Can not determine the preferred package manager');
}

export const detectPackageManager = (cwd: string) => detect({ cwd }).then(tramsformPackageManager);
