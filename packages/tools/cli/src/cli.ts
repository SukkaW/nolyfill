import path from 'path';
import picocolors from 'picocolors';
import { Command, Option } from 'commander';
import handleError from './handle-error';
import { detectPackageManager, type PackageManager } from './package-manager';
import { renderTree } from './renderTree';

import { overridesPackageJson } from './lib/json';
import type { PKG } from './types';
import { handleSigTerm } from './lib/handle-sigterm';
import { findPackagesCoveredByNolyfill, findPackagesNotCoveredByNolyfill } from './find-coverable-packages';
import { checkForUpdates } from './check-update';
import { generateIssue } from './generate-issue';

interface CliOptions {
  /** see full error messages, mostly for debugging */
  debug?: boolean
}

interface PmCommandOptions {
  /** specify which package manager to use */
  pm: PackageManager | 'auto'
}

const pmCommandOption = new Option('--pm [package manager]', 'specify which package manager to use')
  .choices(['auto', 'npm', 'pnpm', 'yarn'])
  .default('auto', 'detect package manager automatically');

handleSigTerm();

// eslint-disable-next-line @typescript-eslint/no-var-requires -- version
const { version } = require('../package.json') as PKG;

const checkUnsupportedPM = (packageManager: PackageManager) => {
  if (packageManager === 'bun') {
    console.log(`${picocolors.bgRed(picocolors.black(' Error '))} nolyfill does not support ${picocolors.bold('Bun')} at the moment.\n`);
    console.log(`Currently, ${picocolors.bold('Bun')} doesn't support package.json overrides (Details: ${picocolors.underline('https://github.com/oven-sh/bun/issues/1134')}). This feature is essential for nolyfill. We'll add support for ${picocolors.bold('Bun')} once the issue is addressed.\n`);
    return true;
  }
  return false;
};

const printPostInstallInstructions = (packageManager: PackageManager) => {
  console.log(`${picocolors.magenta('Almost complete! One last step:')}\n`);

  switch (packageManager) {
    case 'npm':
      console.log(`${picocolors.dim('>')} Run "${picocolors.bold(picocolors.green('npm update'))}" to finish the optimization.\n`);
      console.log(`${picocolors.bold(picocolors.bgYellow(picocolors.black(' WARNING ')))} Using ${picocolors.red('npm update')} will rebuild the entire package-lock.json file, potentially causing unwanted upgrades and side effects. Please review package versions and test your application thoroughly after updating.\n`);
      console.log(`Due to a known bug in NPM (see ${picocolors.underline('https://github.com/npm/cli/issues/5850')}), you need to execute ${picocolors.green('npm update')} instead of the standard "npm install". This ensures NPM to respect the overrides added by nolyfill. We appreciate your understanding and are closely monitoring this issue for any resolutions.\n`);
      break;
    case 'pnpm':
      console.log(`${picocolors.dim('>')} Run "${picocolors.bold(picocolors.green('pnpm install'))}" to finish the optimization.\n`);
      break;
    case 'yarn':
      console.log(`${picocolors.dim('>')} Run "${picocolors.bold(picocolors.green('yarn install'))}" to finish the optimization.\n`);
      break;
    default:
      break;
  }
};

const program = new Command('nolyfill');
(async () => {
  try {
    program
      .version(version, '-v, --version', 'output the current version')
      .option('-d, --debug', 'see full error messages, mostly for debugging');

    program
      .command('check', { isDefault: true })
      .description('check if the project contains redundant polyfills that can be optimized by nolyfill')
      .argument('[path]', 'project path to check')
      .addOption(pmCommandOption)
      .action(async (source: string | undefined, option: PmCommandOptions) => {
        const projectPath = path.resolve(source ?? process.cwd());
        const packageManager = option.pm === 'auto' ? await detectPackageManager(projectPath) : option.pm;

        if (checkUnsupportedPM(packageManager)) {
          return;
        }

        const packagesToBeOverride = await findPackagesCoveredByNolyfill(packageManager, projectPath);

        if (packagesToBeOverride.length === 0) {
          const packagesNotCoveredByNolyfill = await findPackagesNotCoveredByNolyfill(packageManager, projectPath);

          if (packagesNotCoveredByNolyfill.length === 0) {
            console.log(`${picocolors.green('Congratulations! Your project does not contain any redundant polyfills that can be optimized by nolyfill 🚀')}\n`);
          } else {
            await generateIssue(projectPath, packageManager, packagesNotCoveredByNolyfill);
          }
        } else {
          console.log(picocolors.yellow(`Found ${picocolors.green(picocolors.bold(packagesToBeOverride.length))} redundant packages:`));
          console.log(renderTree(packagesToBeOverride));

          console.log(`Run "${picocolors.bold(picocolors.green('nolyfill install'))}" to replace them with a super lightweight ✨ version.\n`);
        }
      });

    program
      .command('install')
      .description('replace redundant polyfills inside your project with nolyfill')
      .argument('[path]', 'project path to install nolyfill into')
      .addOption(pmCommandOption)
      .action(async (source: string | undefined, option: PmCommandOptions) => {
        const projectPath = path.resolve(source ?? process.cwd());
        const packageManager = option.pm === 'auto' ? await detectPackageManager(projectPath) : option.pm;

        if (checkUnsupportedPM(packageManager)) {
          return;
        }

        const packagesToBeOverride = await findPackagesCoveredByNolyfill(packageManager, projectPath);

        if (packagesToBeOverride.length === 0) {
          const packagesNotCoveredByNolyfill = await findPackagesNotCoveredByNolyfill(packageManager, projectPath);

          if (packagesNotCoveredByNolyfill.length === 0) {
            console.log(`${picocolors.green('Congratulations! Your project does not contain any redundant polyfills that can be optimized by nolyfill 🚀')}\n`);
          } else {
            await generateIssue(projectPath, packageManager, packagesNotCoveredByNolyfill);
          }
        } else {
          console.log(picocolors.yellow(`Found ${picocolors.green(picocolors.bold(packagesToBeOverride.length))} redundant packages:`));
          console.log(renderTree(packagesToBeOverride));

          await overridesPackageJson(packageManager, projectPath, packagesToBeOverride);

          printPostInstallInstructions(packageManager);
        }
      });

    await checkForUpdates('nolyfill', version);
    await program.parseAsync(process.argv);
  } catch (e) {
    handleError(e as Error, !!program.opts<CliOptions>().debug);
  }
})();
