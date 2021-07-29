/**
 * Copyright 2021 Design Barn Inc.
 */

const LottieTheming = require('./index.js');

async function applyTheme() {
  const themer = new LottieTheming();
  const data = await themer.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');

  themer.applyTheme('./demo-theme.json', 'theme1');
}

applyTheme();
