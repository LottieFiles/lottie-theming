var LottieTheming = require('./lottie-theming.js');

async function startThemer() {
  let themer = new LottieTheming();
  let data = await themer.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');
  //themer.tokenize();
  var paths = themer.extractPaths();

  paths.forEach(element => {
    //var value = themer.getPathValue(element);
    console.log(`path: ${element.path}, value ${element.value}`);
  });
}

startThemer();
