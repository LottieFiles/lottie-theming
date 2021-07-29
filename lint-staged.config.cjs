/**
 * Copyright 2021 Design Barn Inc.
 */

module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json}': 'prettier --plugin=prettier-plugin-package --write',
  '*.{md,html,css}': 'prettier --write',
};
