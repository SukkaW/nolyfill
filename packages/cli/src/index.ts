import { Command, Option } from 'commander';
import handleError from './handle-error';

import type { PackageJson } from 'type-fest';

// eslint-disable-next-line @typescript-eslint/no-var-requires -- version
const packageJson: PackageJson = require('../package.json');

const program = new Command();

export interface CliOptions {
  /** see full error messages, mostly for debuggin */
  debug?: boolean
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
      .action((source: string | undefined, option: unknown) => {
        console.log(source, option);
        throw new Error('not implemented');
      });

    await program.parseAsync(process.argv);
  } catch (e) {
    handleError(e as Error, !!program.opts<CliOptions>().debug);
  }
})();
