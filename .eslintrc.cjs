/**
 * Copyright 2021 Design Barn Inc.
 */

module.exports = {
  root: true,

  plugins: ['@lottiefiles'],

  extends: [
    // Base configs available:
    'plugin:@lottiefiles/esnext',
    'plugin:@lottiefiles/typescript',

    // Profiles:
    'plugin:@lottiefiles/nodejs',
    // 'plugin:@lottiefiles/typescript-typechecking',

    // Prettier, this must go last
    'plugin:@lottiefiles/prettier',
  ],

  parserOptions: {
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],
  },

  rules: {
    'no-console': 'warn',
  },
};
