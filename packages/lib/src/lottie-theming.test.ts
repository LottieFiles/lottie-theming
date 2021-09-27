import { LottieTheming } from './lottie-theming';

test('Header contains correct text', async () => {
  const theming = new LottieTheming();

  const testPalette = {
    'Color 0': '#ffffffff',
    'Color 1': '#ffffffff',
    'Color 2': '#000000ff',
    'Color 3': '#000000ff',
    'Color 4': '#ffffffff',
    'Color 5': '#ffffffff',
    'Color 6': '#000000ff',
    'Color 7': '#000000ff',
  };

  // developer process 1
  // initialize library
  await theming.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');
  // generate themeconfig file
  const themeConfig = theming.createConfig();

  // developer/designer process 2
  // modify the themeconfig object
  themeConfig['Themes'].push({ testPalette });
  console.dir(themeConfig, { depth: null });

  // press button 1. load default Theme
  theming.applyTheme(themeConfig, 'testPalette');
});
