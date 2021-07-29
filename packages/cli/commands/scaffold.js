// my-module.js
var LottieTheming = require('@lottiefiles/lottie-theming');
var fs = require('fs');

exports.command = 'scaffold'
exports.describe = 'scaffold a theme file'
exports.builder = {
  lottiePath: {
    default: 'lottie.json'
  },
  themePath: {
    default: 'theme.json'
  }
}

exports.handler = async function (argv) {
  const lottiePath = argv.lottie;
  const themePath = argv.themePath;
  
  console.log(`Extracting theme file for lottie: ${lottiePath} to ${themePath}`);
  
  let themer = new LottieTheming();
  await themer.init(lottiePath);
  var themeModel = themer.tokenize(themePath);

  // print full theme config if we receive a --debug?
  // console.dir(themeModel, { depth: null });

  const data = JSON.stringify(themeModel);

  // write JSON string to a file
  fs.writeFile(argv.themePath, data, err => {
    if (err) {
      throw err;
    }
    console.log(`Theme saved to ${themePath}.`);
  });
}