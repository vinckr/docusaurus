#!/usr/bin/env node
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const chalk = require('chalk');
const semver = require('semver');
const path = require('path');
const program = require('commander');
const {default: init} = require('../lib');
const requiredVersion = require('../package.json').engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(
    chalk.red(`\nMinimum Node.js version not met :)`) +
      chalk.yellow(
        `\nYou are using Node.js ${process.version}, Requirement: Node.js ${requiredVersion}.\n`,
      ),
  );
  process.exit(1);
}

function wrapCommand(fn) {
  return (...args) =>
    fn(...args).catch((err) => {
      console.error(chalk.red(err.stack));
      process.exitCode = 1;
    });
}

program
  .version(require('../package.json').version)
  .usage('<command> [options]');

program
  .command('init [siteName] [template] [rootDir]')
  .option('--use-npm')
  .option('--skip-install')
  .option('--typescript')
  .description('Initialize website.')
  .action(
    (siteName, template, rootDir = '.', {useNpm, skipInstall, typescript}) => {
      wrapCommand(init)(path.resolve(rootDir), siteName, template, {
        useNpm,
        skipInstall,
        typescript,
      });
    },
  );

program.arguments('<command>').action((cmd) => {
  program.outputHelp();
  console.log(`  ${chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`)}`);
  console.log();
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
