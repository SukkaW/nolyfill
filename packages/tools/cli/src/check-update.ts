import { join } from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { env } from 'node:process';
import picocolors from 'picocolors';

import { getLatestVersion } from 'fast-npm-meta';

const UPDATE_CHECK_INTERVAL = 3_600_000;
const UPDATE_CHECK_DIST_TAG = 'latest';

const compareVersions = (a: string, b: string) => a.localeCompare(b, 'en-US', { numeric: true });

async function getFile(name: string, scope: string | undefined, distTag: string) {
  const subDir = join(tmpdir(), 'update-check');

  if (!fs.existsSync(subDir)) {
    await fsp.mkdir(subDir, { recursive: true });
  }
  return join(subDir, `${scope ? `${scope}-` : ''}${name}-${distTag}.json`);
}

async function evaluateCache(file: string, time: number, interval: number) {
  if (fs.existsSync(file)) {
    const content = await fsp.readFile(file, 'utf8');
    const { lastUpdate, latest } = JSON.parse(content);
    const nextCheck = lastUpdate + interval;

    // As long as the time of the next check is in
    // the future, we don't need to run it yet
    if (nextCheck > time) {
      return {
        shouldCheck: false,
        latest
      };
    }
  }

  return {
    shouldCheck: true,
    latest: null
  };
}

function updateCache(file: string, latest: string | null, lastUpdate: number) {
  const content = JSON.stringify({
    latest,
    lastUpdate
  });

  return fsp.writeFile(file, content, 'utf8');
}

export async function checkForUpdates(name: string, currentVersion: string): Promise<void> {
  // Do not check for updates if the `NO_UPDATE_CHECK` variable is set.
  if (env.NO_UPDATE_CHECK) return;

  const time = Date.now();

  const isScoped = name.startsWith('/');
  const parts = name.split('/');
  const file = await getFile(
    isScoped ? parts[1] : name,
    isScoped ? parts[0] : undefined,
    UPDATE_CHECK_DIST_TAG
  );

  let latest: string | null = null;
  let shouldCheck = true;

  ({ shouldCheck, latest } = await evaluateCache(file, time, UPDATE_CHECK_INTERVAL));

  if (shouldCheck) {
    latest = (await getLatestVersion(`nolyfill@${UPDATE_CHECK_DIST_TAG}`)).version;
    // If we pulled an update, we need to update the cache
    await updateCache(file, latest, time);
  }

  if (latest) {
    const comparision = compareVersions(currentVersion, latest);

    if (comparision === -1) {
      console.log(
        picocolors.bgRed(picocolors.white(' UPDATE ')),
        `The latest version of "nolyfill" is ${latest}`
      );
    }
  }
}
