/**
 * Copyright 2021 Design Barn Inc.
 */

import { promises as fs } from 'fs';

import { LottieTheming } from '@lottiefiles/lottie-theming';

module.exports.command = 'apply-theme';
module.exports.describe = 'Apply a theme to a lottie';
module.exports.builder = {
  lottiePath: {
    default: 'lottie.json',
  },
  themePath: {
    default: 'theme.json',
  },
  themeName: {
    default: 'default',
  },
  newLottiePath: {
    default: 'themed-lottie.json',
  },
};

module.exports.handler = async function handler(argv) {
  const lottiePath = argv.lottie;
  const themePath = argv.themePath;
  const themeName = argv.themeName;
  const newLottiePath = argv.newLottiePath;

  console.log(`Applying ${themeName} theme from ${themePath} to lottie: ${lottiePath}`);

  const themer = new LottieTheming();

  await themer.init(lottiePath);
  const themedLottie = themer.applyTheme(themePath, themeName);

  const data = JSON.stringify(themedLottie);

  // write JSON string to a file
  fs.promises.writeFile(newLottiePath, data, (err): void => {
    if (err) {
      throw err;
    }
    console.log(`Lottie Themed and saved to ${newLottiePath}.`);
  });
};
