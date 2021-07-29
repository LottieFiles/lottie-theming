/**
 * Copyright 2021 Design Barn Inc.
 */

const LottieTheming = require('./lottie-theming.js');

async function startThemer() {
  const themer = new LottieTheming();
  const data = await themer.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');

  themer.tokenize();
}

startThemer();
