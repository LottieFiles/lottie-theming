var LottieTheming = require('./lottie-theming.js');

async function applyTheme() {
  let themer = new LottieTheming();
  let data = await themer.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');
  themer.applyTheme('./demo-theme.json', 'theme1');
}

applyTheme();
