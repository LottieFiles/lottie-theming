/**
 * Copyright 2021 Design Barn Inc.
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  globals: {
    'ts-jest': {
      packageJson: 'package.json',
    },
  },
};
