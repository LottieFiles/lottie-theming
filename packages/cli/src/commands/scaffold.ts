/**
 * Copyright 2021 Design Barn Inc.
 */

import fs from 'fs';

import { LottieTheming } from '@lottiefiles/lottie-theming';

module.exports.command = 'scaffold';
module.exports.describe = 'scaffold a theme file';
module.exports.builder = {
  lottiePath: {
    default: 'lottie.json',
  },
  themePath: {
    default: 'theme.json',
  },
};

module.exports.handler = async function handler(argv): Promise<void> {
  const lottiePath = argv.lottie;
  const themePath = argv.themePath;

  console.log(`Extracting theme file for lottie: ${lottiePath} to ${themePath}`);

  const themer = new LottieTheming();

  await themer.init(lottiePath);
  const themeModel = themer.tokenize(themePath);

  // print full theme config if we receive a --debug?
  // console.dir(themeModel, { depth: null });

  const data = JSON.stringify(themeModel);

  // write JSON string to a file
  await fs.promises.writeFile(argv.themePath, data, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Theme saved to ${themePath}.`);
  });
};
