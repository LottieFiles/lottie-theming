/**
 * Copyright 2021 Design Barn Inc.
 */

import path from 'path';

import { defineConfig } from 'vite';

import * as pkg from './package.json';

// Extract the package name from the scoped name in package.json
const pkgName = pkg.name.replace(/^@.*\//u, '');

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 */`;

module.exports = defineConfig({
  resolve: {
    mainFields: ['main'],
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'LottieThemingCli',
      fileName: (format: string) => `${pkgName}.${format}.js`,
    },
    rollupOptions: {
      output: {
        banner,
      },
      external: ['fs/promises'],
    },
  },
});
