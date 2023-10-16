import { join } from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { tmpdir } from 'os';
import https from 'https';
import http from 'http';
import { env } from 'process';
import picocolors from 'picocolors';
import type { PackageJson } from 'type-fest';

const UPDATE_CHECK_INTERVAL = 3_600_000;
const UPDATE_CHECK_DIST_TAG = 'latest';

const compareVersions = (a: string, b: string) => a.localeCompare(b, 'en-US', { numeric: true });

const getFile = async (name: string, scope: string | undefined, distTag: string) => {
  const subDir = join(tmpdir(), 'update-check');

  if (!fs.existsSync(subDir)) {
    await fsp.mkdir(subDir, { recursive: true });
  }
  return join(subDir, `${scope ? `${scope}-` : ''}${name}-${distTag}.json`);
};

const evaluateCache = async (file: string, time: number, interval: number) => {
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
};

const updateCache = (file: string, latest: string | null, lastUpdate: number) => {
  const content = JSON.stringify({
    latest,
    lastUpdate
  });

  return fsp.writeFile(file, content, 'utf8');
};

const loadPackage = (url: URL) => new Promise<PackageJson>((resolve, reject) => {
  const options: https.RequestOptions = {
    host: url.hostname,
    path: url.pathname,
    port: url.port,
    headers: {
      accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
    },
    timeout: 2000
  };

  const { get } = url.protocol === 'https:' ? https : http;
  get(options, response => {
    const { statusCode } = response;

    if (statusCode !== 200) {
      const error = new Error(`Request failed with code ${statusCode}`);
      Object.defineProperty(error, 'code', { value: statusCode });

      reject(error);

      // Consume response data to free up RAM
      response.resume();
      return;
    }

    let rawData = '';
    response.setEncoding('utf8');

    response.on('data', chunk => {
      rawData += chunk;
    });

    response.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        resolve(parsedData);
      } catch (e) {
        reject(e);
      }
    });
  }).on('error', reject).on('timeout', reject);
});

const getMostRecent = async (distTag: string): Promise<string | null> => {
  const url = new URL(`https://registry.npmjs.org/nolyfill/${distTag}`);

  try {
    const spec = await loadPackage(url);
    return spec.version ?? null;
  } catch {
    return null;
  }
};

export const checkForUpdates = async (name: string, currentVersion: string): Promise<void> => {
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
    latest = (await getMostRecent(UPDATE_CHECK_DIST_TAG)) ?? null;
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
};
