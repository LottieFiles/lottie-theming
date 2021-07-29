#!/usr/bin/env node

//
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

var { argv } = require("yargs")
  .commandDir("commands")
  .demandCommand();
