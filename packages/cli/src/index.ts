/**
 * Copyright 2021 Design Barn Inc.
 */

//
import yargs from 'yargs';

//import { commands } from './commands';
import { applyThemeCommand } from './commands/apply-theme-command';

yargs.command(applyThemeCommand).demandCommand();
