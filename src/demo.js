/**
 * Copyright 2021 Design Barn Inc.
 */

const { LottieTheming, ThemeConfig } = require('./lottie-theming.js');

const fs = require('fs');
const console = require('console');

async function startThemer() {
  let themer = new LottieTheming();
  let data = await themer.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');

  themer.tokenize();
}

async function loadConfig() {
  const json = fs.readFileSync('./demo-config.json');

  //console.log(`parsing config.. ${json}`);

  const themeConfig = ThemeConfig.fromJSON(json);

  console.log(themeConfig.themes);
}

//startThemer();

loadConfig();
