/* eslint-disable no-console -- We're a CLI, we need to log to the console */
import path from 'node:path';
import picocolors from 'picocolors';
import { Command, Option } from 'commander';
import handleError from './handle-error';
import { detectPackageManager, type PackageManager } from './package-manager';
import { searchPackages } from './lockfile';
import { renderTree } from './renderTree';
import { allPackages } from './all-packages';
import { readJSON, writeJSON } from './packages';
import type { PackageJson } from 'type-fest';
import type { PackageNode } from './lockfile/types';

declare module 'type-fest' {
  interface PackageJson {
    version: string,
    overrides?: Record<string, string>,
    resolutions?: Record<string, string>,
    pnpm?: {
      overrides?: Record<string, string>
    }
  }
}

interface CliOptions {
  /** see full error messages, mostly for debugging */
  debug?: boolean
}

interface PmCommandOptions {
  /** specify which package manager to use */
  pm: PackageManager | 'auto'
}

const pmCommandOption = new Option('--pm', 'specify which package manager to use')
  .choices(['auto', 'npm', 'pnpm', 'yarn'])
  .default('auto', 'detect package manager automatically');

const handleSigTerm = () => process.exit(0);
process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

// eslint-disable-next-line @typescript-eslint/no-var-requires -- version
const packageJson: PackageJson = require('../package.json');

const findPackagesCoveredByNolyfill = async (packageManager: PackageManager, projectPath: string) => {
  const searchResult = await searchPackages(packageManager, projectPath, allPackages);
  // console.log(renderTree(searchResult));

  const packagesToBeOverride: PackageNode[] = [];

  const traverse = (node: PackageNode) => {
    if (allPackages.includes(node.name) && !packagesToBeOverride.some(leaf => leaf.name === node.name)) {
      delete node.dependencies;
      packagesToBeOverride.push(node);
    } else if (node.dependencies) {
      node.dependencies.forEach(child => traverse(child));
    }
  };

  searchResult.forEach(node => traverse(node));

  packagesToBeOverride.sort((a, b) => a.name.localeCompare(b.name));

  console.log(picocolors.yellow(`Found ${picocolors.green(picocolors.bold(packagesToBeOverride.length))} redundant packages:`));
  console.log(renderTree(packagesToBeOverride));

  return packagesToBeOverride;
};

const applyOverrides = async (packageManager: PackageManager, projectPath: string, packages: PackageNode[]) => {
  const overrides = Object.fromEntries(packages.map((node) => [
    node.name,
    `npm:@nolyfill/${node.name}@latest`
  ]));
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await readJSON<PackageJson>(packageJsonPath);
  if (!packageJson) return;

  // https://pnpm.io/package_json#pnpmoverrides
  if (packageManager === 'pnpm') {
    if (!packageJson.pnpm) packageJson.pnpm = {};
    packageJson.pnpm.overrides = {
      ...packageJson.pnpm.overrides,
      ...overrides
    };
  // https://yarnpkg.com/configuration/manifest/#resolutions
  } else if (packageManager === 'yarn') {
    if (!packageJson.resolutions) packageJson.resolutions = {};
    packageJson.resolutions = {
      ...packageJson.resolutions,
      ...overrides
    };
  } else {
    packageJson.overrides = {
      ...packageJson.overrides,
      ...overrides
    };
  }

  await writeJSON(packageJsonPath, packageJson);
};

const printBunUnsupported = () => {
  console.log(`${picocolors.bgRed(picocolors.black(' Error '))} nolyfill does not support ${picocolors.bold('Bun')} at the moment.\n`);
  console.log(`Currently, ${picocolors.bold('Bun')} doesn't support package.json overrides (Details: ${picocolors.underline('https://github.com/oven-sh/bun/issues/1134')}). This feature is essential for nolyfill. We'll add support for ${picocolors.bold('Bun')} once the issue is addressed.\n`);
};

const printPostInstallInstructions = (packageManager: PackageManager) => {
  console.log(`${picocolors.magenta('Optimization complete!')}\n`);

  switch (packageManager) {
    case 'npm':
      console.log(`${picocolors.dim('>')} Run "${picocolors.bold(picocolors.green('npm update'))}" to install the optimized packages.\n`);
      console.log(`${picocolors.bold(picocolors.bgYellow(picocolors.black(' WARNING ')))} Using ${picocolors.red('npm update')} will rebuild the entire package-lock.json file, potentially causing unwanted upgrades and side effects. Please review package versions and test your application thoroughly after updating.\n`);
      console.log(`Due to a known bug in NPM (see ${picocolors.underline('https://github.com/npm/cli/issues/5850')}), you need to execute ${picocolors.green('npm update')} instead of the standard "npm install". This ensures NPM to respect the overrides added by nolyfill. We appreciate your understanding and are closely monitoring this issue for any resolutions.\n`);
      break;
    case 'pnpm':
      console.log(`${picocolors.dim('>')} Run "${picocolors.bold(picocolors.green('pnpm install'))}" to install the optimized packages.\n`);
      break;
    case 'yarn':
      console.log(`${picocolors.dim('>')} Run "${picocolors.bold(picocolors.green('yarn install'))}" to install the optimized packages.\n`);
      break;
    default:
      break;
  }
};

const program = new Command();
(async () => {
  try {
    program
      .name('nolyfill [source]')
      .version(packageJson.version, '-v, --version', 'output the current version')
      .option('-d, --debug', 'see full error messages, mostly for debugging');

    program
      .command('check')
      .description('check if the project contains redundant polyfills that can be optimized by nolyfill')
      .argument('[path]', 'project path to check')
      .addOption(pmCommandOption)
      .action(async (source: string | undefined, option: PmCommandOptions) => {
        const projectPath = path.resolve(source ?? process.cwd());
        const packageManager = option.pm === 'auto' ? await detectPackageManager(projectPath) : option.pm;

        if (packageManager === 'bun') {
          printBunUnsupported();
          return;
        }

        await findPackagesCoveredByNolyfill(packageManager, projectPath);

        console.log(`Run "${picocolors.bold(picocolors.green('nolyfill install'))}" to replace them with a super lightweight ✨ version.\n`);
      });

    program
      .command('install')
      .description('replace redundant polyfills inside your project with nolyfill')
      .argument('[path]', 'project path to install nolyfill into')
      .addOption(pmCommandOption)
      .action(async (source: string | undefined, option: PmCommandOptions) => {
        const projectPath = path.resolve(source ?? process.cwd());
        const packageManager = option.pm === 'auto' ? await detectPackageManager(projectPath) : option.pm;

        if (packageManager === 'bun') {
          printBunUnsupported();
          return;
        }

        const packages = await findPackagesCoveredByNolyfill(packageManager, projectPath);

        await applyOverrides(packageManager, projectPath, packages);

        printPostInstallInstructions(packageManager);
      });

    await program.parseAsync(process.argv);
  } catch (e) {
    handleError(e as Error, !!program.opts<CliOptions>().debug);
  }
})();
