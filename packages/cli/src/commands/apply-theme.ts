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

module.exports.handler = async function handler(argv: {
  lottie: string;
  newLottiePath: string;
  themeName: string;
  themePath: string;
}): Promise<void> {
  console.log(`Applying ${argv.themeName} theme from ${argv.themePath} to lottie: ${argv.lottie}`);

  const themer = new LottieTheming();

  await themer.init(argv.lottie);
  const themedLottie = themer.applyTheme(argv.themePath, argv.themeName);

  const data = JSON.stringify(themedLottie);

  // write JSON string to a file
  const promise = fs.writeFile(argv.newLottiePath, data);

  await promise;
};
