/* eslint-disable no-console -- We're a CLI, we need to log to the console */
import path from 'node:path';
import { Command, Option } from 'commander';
import handleError from './handle-error';
import { detectPackageManager, type PackageManager } from './package-manager';
import { searchPackages } from './lockfile';
import { renderTree } from './renderTree';
import { allPackages } from './all-packages';
import type { PackageJson } from 'type-fest';
import { getDedupeLeafNodes } from './get-dedupe-leaf-node';
import { readJSON, writeJSON } from './packages';
import type { PackageJson } from 'type-fest';

// eslint-disable-next-line @typescript-eslint/no-var-requires -- version
const packageJson: PackageJson = require('../package.json');

declare module 'type-fest' {
  interface PackageJson {
    overrides?: Record<string, string>
  }
}

const program = new Command();

export interface CliOptions {
  /** see full error messages, mostly for debugging */
  debug?: boolean
}

interface PmCommandOptions {
  /** specify which package manager to use */
  pm: PackageManager | 'auto'
}

const handleSigTerm = () => process.exit(0);

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

(async () => {
  try {
    program
      .name('nolyfill [source]')
      .version(packageJson.version!, '-v, --version', 'output the current version')
      .option('-d, --debug', 'see full error messages, mostly for debugging');

    program
      .command('install')
      .argument('[path]', 'project path to install nolyfill into')
      .addOption(
        new Option('--pm', 'specify which package manager to use')
          .choices(['auto', 'npm', 'pnpm', 'yarn', 'bun'])
          .default('auto', 'detect package manager automatically')
      )
      .description('replace redundant polyfills inside your project\'s node_modules with nolyfill')
      .action(async (source: string | undefined, option: PmCommandOptions) => {
        const projectPath = path.resolve(source ?? process.cwd());
        const packageManager = option.pm === 'auto' ? await detectPackageManager(projectPath) : option.pm;

        const searchResult = await searchPackages(packageManager, projectPath, allPackages);
        // console.log(renderTree(searchResult));

        const leafNodes = getDedupeLeafNodes(searchResult);
        console.log('The following packages will be overridden:');
        console.log(renderTree(leafNodes));

        const overrides = Object.fromEntries(leafNodes.map((node) => [
          node.name,
          `npm:@nolyfill/${node.name}@latest`
        ]));
        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = await readJSON<PackageJson>(packageJsonPath);
        if (!packageJson) return;

        packageJson.overrides = {
          ...packageJson.overrides,
          ...overrides
        };
        // TODO: confirm with user
        await writeJSON(packageJsonPath, packageJson);
      });

    await program.parseAsync(process.argv);
  } catch (e) {
    handleError(e as Error, !!program.opts<CliOptions>().debug);
  }
})();
