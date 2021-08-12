/**
 * Copyright 2021 Design Barn Inc.
 */

// module.exports = {
//   preset: 'ts-jest',
//   transform: {
//     '^.+\\.(ts|tsx)?$': 'ts-jest',
//     '^.+\\.(js|jsx)$': 'babel-jest',
//   },
// };

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
