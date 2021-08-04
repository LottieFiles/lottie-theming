/**
 * Copyright 2021 Design Barn Inc.
 */

const LottieTheming = require('../dist/lottie-theming.umd');

function extractColor() {
  const theming = new LottieTheming();

  theming.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');
}

extractColor();
