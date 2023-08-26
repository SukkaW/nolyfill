import { packageSize } from './all-packages';
import type { PackageNode } from './types';
import picocolors from 'picocolors';

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;

  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024;
    index++;
  }

  return `${bytes.toFixed(2)} ${units[index]}`;
}

const calcReducedSize = (packageList: PackageNode[]) => {
  let totalSizeInstall = 0;
  let totalSizePublish = 0;

  for (const { name } of packageList) {
    totalSizeInstall += packageSize[name].install;
    totalSizePublish += packageSize[name].publish;
  }

  return { totalSizeInstall, totalSizePublish };
};

export const genReducedSizeMessage = (packageList: PackageNode[], { willReduce = false }: { willReduce?: boolean } = {}) => {
  const { totalSizeInstall, totalSizePublish } = calcReducedSize(packageList);
  const formatReducedSize = (size: number) => picocolors.bold(picocolors.bgBlack(picocolors.white(formatBytes(size))));

  return `Nolyfill ${willReduce ? 'will reduce' : 'have reduced'} ${formatReducedSize(totalSizeInstall)} on your disk and ${formatReducedSize(totalSizePublish)} for your users!
${picocolors.gray('Note that the size reduction is only an estimate, the actual size reduction may vary.')}`;
};
