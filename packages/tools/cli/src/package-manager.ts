import { detect } from 'package-manager-detector';
import type { DetectResult } from 'package-manager-detector';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export function tramsformPackageManager(input: DetectResult | null): PackageManager {
  if (input == null) {
    throw new Error('Can not determine the preferred package manager');
  }
  return input.agent.split('@')[0] as PackageManager;
}

export const detectPackageManager = (cwd: string) => detect({ cwd }).then(tramsformPackageManager);
