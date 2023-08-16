/* eslint-disable no-console -- We're a CLI, we need to log to the console */
import { Command, Option } from 'commander';
import handleError from './handle-error';

import type { PackageJson } from 'type-fest';
import { detectPackageManager, type PackageManager } from './package-manager';
import { searchPackages } from './lockfile';
import path from 'node:path';
import { renderTree } from './renderTree';

// eslint-disable-next-line @typescript-eslint/no-var-requires -- version
const packageJson: PackageJson = require('../package.json');

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

        const targetPackages = ['es-abstract'];
        const result = await searchPackages(packageManager, projectPath, targetPackages);
        if (result) {
          const output = renderTree(result, targetPackages);
          console.log(output);
        }
      });

    await program.parseAsync(process.argv);
  } catch (e) {
    handleError(e as Error, !!program.opts<CliOptions>().debug);
  }
})();
