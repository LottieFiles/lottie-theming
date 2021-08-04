/**
 * Copyright 2021 Design Barn Inc.
 */

import path from 'path';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript2 from 'rollup-plugin-typescript2';
import { defineConfig } from 'vite';

import * as pkg from './package.json';

// Extract the package name from the scoped name in package.json
const pkgName = pkg.name.replace(/^@.*\//u, '');

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 */`;

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'LottieTheming',
      fileName: (format: string) => `${pkgName}.${format}.js`,
    },
    rollupOptions: {
      output: {
        banner,
        sourcemap: true,
      },
      plugins: [
        nodeResolve(),
        commonjs({
          exclude: 'node_modules',
          ignoreGlobal: true,
        }),
        typescript2({
          useTsconfigDeclarationDir: true,
        }),
      ],
    },
  },
});
