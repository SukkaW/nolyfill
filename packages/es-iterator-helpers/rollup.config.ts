import type { PackageJson } from 'type-fest';

import resolve from 'resolve-pkg';
import fs from 'fs';

export default async function build() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires -- safe
  const esIteratorHelpersPkgJsonPath = resolve('es-iterator-helpers/package.json');
  if (!esIteratorHelpersPkgJsonPath) {
    throw new Error('Could not find es-iterator-helpers/package.json');
  }
  const esIteratorHelpersPkgJson: PackageJson = JSON.parse(fs.readFileSync(esIteratorHelpersPkgJsonPath, 'utf-8'));

  console.log(Object.values(esIteratorHelpersPkgJson.exports || {}));
}
