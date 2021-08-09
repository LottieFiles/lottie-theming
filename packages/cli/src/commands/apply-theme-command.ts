/**
 * Copyright 2021 Design Barn Inc.
 */

import { writeFile } from 'fs/promises';

import { LottieTheming } from '@lottiefiles/lottie-theming';
import { Arguments, CommandModule } from 'yargs';

interface ApplyThemeArgs {
  lottie: string;
  newLottiePath: string;
  themeName: string;
  themePath: string;
}

const applyThemeCommand: CommandModule<unknown, ApplyThemeArgs> = {
  command: 'theme',
  describe: 'Apply a theme to a lottie',
  builder: {
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
  },
  handler: async (argv: Arguments<ApplyThemeArgs>) => {
    console.log(`Applying ${argv.themeName} theme from ${argv.themePath} to lottie: ${argv.lottie}`);

    const themer = new LottieTheming();

    await themer.init(argv.lottie);
    const themedLottie = themer.applyTheme(argv.themePath, argv.themeName);

    const data = JSON.stringify(themedLottie);

    writeFile(argv.newLottiePath, data);
  },
};

export { applyThemeCommand };
export type { ApplyThemeArgs };
