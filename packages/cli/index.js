#!/usr/bin/env node
/**
 * Copyright 2021 Design Barn Inc.
 */

//
const yargs = require('yargs');

yargs.commandDir('commands').demandCommand();
