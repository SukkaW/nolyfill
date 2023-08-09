// @ts-check
const fsPromises = require('fs/promises');
const path = require('path');

(async () => {
  const packageName = process.argv.slice(2)[0];

  const packagePath = path.join(__dirname, 'packages', packageName);

  await fsPromises.mkdir(
    packagePath,
    { recursive: true }
  );

  await Promise.all([
    fsPromises.writeFile(
      path.join(packagePath, 'index.js'),
      'const { uncurryThis } = require(\'@nolyfill/shared\');\n\nmodule.exports = \n',
      { encoding: 'utf-8' }
    ),
    fsPromises.writeFile(
      path.join(packagePath, 'package.json'),
      `${JSON.stringify({
        name: `@nolyfill/${packageName}`,
        version: '0.0.0',
        main: './index.js',
        license: 'MIT',
        files: [
          '*.js'
        ],
        scripts: {
          lint: 'eslint .'
        },
        dependencies: {
          '@nolyfill/shared': 'workspace:*'
        }
      }, null, 2)}\n`,
      { encoding: 'utf-8' }
    )
  ]);
})();
