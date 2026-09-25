import path from 'node:path';
import process from 'node:process';
import picocolors from 'picocolors';
import { Command, Option } from 'commander';
import handleError from './handle-error';
import { renderTree } from './renderTree';

import { overridesPackageJson } from './overrides';
import type { OverridesResult } from './overrides';
import type { PKG } from './types';
import { handleSigTerm } from './lib/handle-sigterm';
import { findPackagesCoveredByNolyfill, findPackagesNotCoveredByNolyfill } from './find-coverable-packages';
import { checkForUpdates } from './check-update';
import { generateIssue } from './generate-issue';
import { LOCKFILES, detectPackageManager, findProjectRoot, getPackageManagerVersion, npmIgnoresNewOverrides } from './package-manager';
import type { PackageManager } from './package-manager';

interface CliOptions {
  /** see full error messages, mostly for debugging */
  debug?: boolean
}

interface PmCommandOptions {
  /** specify which package manager to use */
  pm: PackageManager | 'auto'
}

interface CheckCommandOptions extends PmCommandOptions {
  format: 'normal' | 'json'
}

const pmCommandOption = new Option('--pm [package manager]', 'specify which package manager to use')
  .choices(['auto', 'npm', 'pnpm', 'yarn'])
  .default('auto', 'detect package manager automatically');

handleSigTerm();

// eslint-disable-next-line @typescript-eslint/no-require-imports -- TBD
const { version } = require('../package.json') as PKG;

function checkUnsupportedPM(packageManager: PackageManager) {
  if (packageManager === 'bun') {
    console.log(`${picocolors.bgRed(picocolors.black(' Error '))} nolyfill does not support ${picocolors.bold('Bun')} at the moment.\n`);
    console.log(`The nolyfill CLI can not read ${picocolors.bold('bun.lock')} yet. You can still add the overrides to your package.json manually, see ${picocolors.underline('https://github.com/SukkaW/nolyfill')} for the list of packages.\n`);
    return true;
  }
  return false;
}

/**
 * Locate the root of the project (where the lockfile lives). nolyfill can be invoked from a
 * workspace package, but overrides can only be declared at the root.
 */
async function resolveProject(source: string | undefined, pm: PackageManager | 'auto') {
  const startPath = path.resolve(source ?? process.cwd());
  const packageManager = pm === 'auto' ? await detectPackageManager(startPath) : pm;

  if (checkUnsupportedPM(packageManager)) {
    return null;
  }

  const projectPath = await findProjectRoot(startPath, packageManager);
  if (!projectPath) {
    throw new Error(`Can not find ${LOCKFILES[packageManager].join(' or ')} in ${startPath} or any of its parent directories, please run "${packageManager} install" first`);
  }
  if (projectPath !== startPath) {
    console.log(`${picocolors.dim('>')} Using the workspace root at ${picocolors.bold(projectPath)}\n`);
  }

  return { packageManager, projectPath };
}

async function printPostInstallInstructions(packageManager: PackageManager, projectPath: string, result: OverridesResult) {
  console.log(`${picocolors.green('✓')} Overrides written to ${picocolors.bold(path.relative(process.cwd(), result.overridesFile) || result.overridesFile)}`);
  if (result.migratedFromPackageJson) {
    console.log(`${picocolors.green('✓')} Existing "pnpm.overrides" moved from package.json to pnpm-workspace.yaml (pnpm 11+ no longer reads settings from package.json)`);
  }
  if (result.updatedDirectDependencies.length > 0) {
    console.log(`${picocolors.green('✓')} Direct dependencies now pointing to nolyfill: ${result.updatedDirectDependencies.map(name => picocolors.bold(name)).join(', ')}`);
  }
  console.log(`\n${picocolors.magenta('Almost complete! One last step:')}\n`);

  switch (packageManager) {
    case 'npm': {
      const npmVersion = await getPackageManagerVersion(projectPath, packageManager);
      if (!npmIgnoresNewOverrides(npmVersion)) {
        console.log(`${picocolors.dim('>')} Run "${picocolors.bold(picocolors.green('npm install'))}" to finish the optimization.\n`);
        break;
      }

      console.log(`${picocolors.dim('>')} Run "${picocolors.bold(picocolors.green('npm update'))}" to finish the optimization.\n`);
      console.log(`${picocolors.bold(picocolors.bgYellow(picocolors.black(' WARNING ')))} Using ${picocolors.red('npm update')} will rebuild the entire package-lock.json file, potentially causing unwanted upgrades and side effects. Please review package versions and test your application thoroughly after updating.\n`);
      console.log(`${npmVersion === null ? 'npm before 11.2.0 ignores' : `Your npm (${picocolors.bold(npmVersion)}) ignores`} the overrides added to package.json when a package-lock.json already exists (see ${picocolors.underline('https://github.com/npm/cli/issues/5850')}), which is why you need to execute ${picocolors.green('npm update')} instead of the standard "npm install". Alternatively, delete package-lock.json and node_modules and run "${picocolors.green('npm install')}", or upgrade npm to 11.2.0 or newer.\n`);
      break;
    }
    case 'pnpm':
      console.log(`${picocolors.dim('>')} Run "${picocolors.bold(picocolors.green('pnpm install'))}" to finish the optimization.\n`);
      break;
    case 'yarn':
      console.log(`${picocolors.dim('>')} Run "${picocolors.bold(picocolors.green('yarn install'))}" to finish the optimization.\n`);
      break;
    default:
      break;
  }
}

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
      .addOption(new Option('-f --format [format]', 'output format for console')
        .choices(['humanreadable', 'json'])
        .default('humanreadable'))
      .action(async (source: string | undefined, option: CheckCommandOptions) => {
        const project = await resolveProject(source, option.pm);
        if (!project) return;
        const { packageManager, projectPath } = project;

        const format = option.format;

        const packagesToBeOverride = await findPackagesCoveredByNolyfill(packageManager, projectPath);

        if (format === 'json') {
          const packagesNotCoveredByNolyfill = await findPackagesNotCoveredByNolyfill(packageManager, projectPath);
          console.log(JSON.stringify({ packagesCoveredByNolyfill: packagesToBeOverride, packagesNotCoveredByNolyfill }));
          return;
        }

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
        const project = await resolveProject(source, option.pm);
        if (!project) return;
        const { packageManager, projectPath } = project;

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

          const result = await overridesPackageJson(packageManager, projectPath, packagesToBeOverride);

          await printPostInstallInstructions(packageManager, projectPath, result);
        }
      });

    await checkForUpdates('nolyfill', version);
    await program.parseAsync(process.argv);
  } catch (e) {
    handleError(e as Error, !!program.opts<CliOptions>().debug);
  }
})();
