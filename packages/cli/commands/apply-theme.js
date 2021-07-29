var LottieTheming = require('@lottiefiles/lottie-theming');
var fs = require('fs');

exports.command = 'apply-theme'
exports.describe = 'Apply a theme to a lottie'
exports.builder = {
  lottiePath: {
    default: 'lottie.json'
  },
  themePath: {
    default: 'theme.json'
  },
  themeName: {
    default: 'default'
  },
  newLottiePath: {
    default: 'themed-lottie.json'
  }
}

exports.handler = async function (argv) {
  const lottiePath = argv.lottie;
  const themePath = argv.themePath;
  const themeName = argv.themeName;
  const newLottiePath = argv.newLottiePath;

  console.log(`Applying ${themeName} theme from ${themePath} to lottie: ${lottiePath}`);
  
  let themer = new LottieTheming();
  await themer.init(lottiePath);
  var themedLottie = themer.applyTheme(themePath, themeName);

  const data = JSON.stringify(themedLottie);

  // write JSON string to a file
  fs.writeFile(newLottiePath, data, err => {
    if (err) {
      throw err;
    }
    console.log(`Lottie Themed and saved to ${newLottiePath}.`);
  });
}