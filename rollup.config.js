/**
 * Copyright 2021 Design Barn Inc.
 */

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import filesize from 'rollup-plugin-filesize';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import typescript2 from 'rollup-plugin-typescript2';

const production = !process.env.ROLLUP_WATCH;
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs'];
const outputDir = './dist/';

export default {
  input: './src/index.ts',
  treeshake: false,
  output: [
    {
      file: './dist/lottie-theming.esm.js',
      // dir: outputDir,
      format: 'es',
      sourcemap: true,
    },
    {
      file: './dist/lottie-theming.js',
      format: 'umd',
      name: 'lottie-theming',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({ extensions }),
    commonjs({ include: /node_modules/ }),
    typescript2({
      check: false,
    }),
    babel({
      extensions,
      exclude: ['./node_modules/@babel/**/*', './node_modules/core-js/**/*'],
    }),
    !production &&
      copy({
        targets: [
          { src: './src/demo-lottie.json', dest: outputDir },
          { src: './src/demo-config.json', dest: outputDir },
          { src: './src/demo.js', dest: outputDir },
        ],
      }),
    filesize(),
    // !production &&
    //   serve({
    //     contentBase: [outputDir],
    //     open: true,
    //     host: 'localhost',
    //     port: 10000,
    //   }),

    production && terser(),
  ],
};
