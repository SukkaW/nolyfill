import { detect } from 'package-manager-detector';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
type PackageManagerDetectorReturn = Awaited<ReturnType<typeof detect>>;

export function tramsformPackageManager(input: PackageManagerDetectorReturn): PackageManager {
  if (input.agent == null) {
    throw new Error('Can not determine the preferred package manager');
  }
  return input.agent.split('@')[0] as PackageManager;
}

export const detectPackageManager = (cwd: string) => detect({ cwd }).then(tramsformPackageManager);
