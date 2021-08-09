/**
 * Copyright 2021 Design Barn Inc.
 */

import fs from 'fs';

import { LottieTheming } from '@lottiefiles/lottie-theming';
import { Arguments, CommandModule } from 'yargs';

interface ScaffoldArgs extends Arguments {
  lottie: string;
  themePath: string;
}

const scaffoldCommand: CommandModule<void, ScaffoldArgs> = {
  command: 'scaffold',
  describe: 'Scaffold a new theme file for a lottie, allowing you to create new themes',
  builder: {
    lottiePath: {
      default: 'lottie.json',
    },
    themePath: {
      default: 'theme.json',
    },
  },
  handler: async (argv: ScaffoldArgs): Promise<void> => {
    const lottiePath = argv.lottie;
    const themePath = argv.themePath;

    console.log(`Extracting theme file for lottie: ${lottiePath} to ${themePath}`);

    const themer = new LottieTheming();

    await themer.init(lottiePath);
    const themeModel = themer.tokenize();

    // print full theme config if we receive a --debug?
    // console.dir(themeModel, { depth: null });

    const data = JSON.stringify(themeModel);

    await fs.promises.writeFile(argv.themePath, data);
  },
};

export { scaffoldCommand };
export type { ScaffoldArgs };
