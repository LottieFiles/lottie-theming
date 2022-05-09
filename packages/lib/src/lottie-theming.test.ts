import { LottieTheming } from './lottie-theming';

test('Header contains correct text', async () => {
  const theming = new LottieTheming();

  // const testPalette = {
  //   'Color 0': '#ffffffff',
  //   'Color 1': '#ffffffff',
  //   'Color 2': '#000000ff',
  //   'Color 3': '#000000ff',
  //   'Color 4': '#ffffffff',
  //   'Color 5': '#ffffffff',
  //   'Color 6': '#120000ff',
  //   'Color 7': '#000000ff',
  // };

  // const testConfig = {
  //   lightTheme: {
  //     '#arm': {
  //       fillColor: '#eeeee4',
  //     },
  //     '.legs': {
  //       fillColor: '#eeeee4',
  //       strokeColor: '#eeeee4',
  //     },
  //     '.skincolor': {
  //       fillColor: '#eeeee4',
  //     },
  //     '#heroText': {
  //       text: 'MEEEE',
  //     },
  //   },
  //   darkTheme: {
  //     '#arm': {
  //       fillColor: '#000000',
  //     },
  //     '.legs': {
  //       fillColor: '#000000',
  //       strokeColor: '#000000',
  //     },
  //     '.skincolor': {
  //       fillColor: '#000000',
  //     },
  //     '#heroText': {
  //       text: 'YOUUUU',
  //     },
  //   },
  // };

  // const testConfig2 = {
  //   lightTheme: {
  //     '#solid': {
  //       fillColor: '#eeeee4',
  //     },
  //     '.shape': {
  //       fillColor: '#eeeee4',
  //       strokeColor: '#eeeee4',
  //     },
  //     // should take precedence over .shape
  //     '.path': {
  //       fillColor: '#D68C8C',
  //     },
  //     '.polystar': {
  //       fillColor: '#D68C8C',
  //     },
  //     // should take precedence over classes
  //     '#ellipse': {
  //       fillColor: '#eeeee4',
  //     },
  //     '#rectangle': {
  //       fillColor: '#eeeee4',
  //     },
  //     '#heroText': {
  //       text: 'MEEEE',
  //     },
  //   },
  //   darkTheme: {
  //     '#solid': {
  //       fillColor: '#000000',
  //     },
  //     '.shape': {
  //       fillColor: '#000000',
  //       strokeColor: '#000000',
  //     },
  //     '.path': {
  //       fillColor: '#000000',
  //     },
  //     '.polystar': {
  //       fillColor: '#000000',
  //     },
  //     '#ellipse': {
  //       fillColor: '#000000',
  //     },
  //     '#rectangle': {
  //       fillColor: '#000000',
  //     },
  //     '#heroText': {
  //       text: 'YOUUUU',
  //     },
  //   },
  // };
  // const testConfig3 = {
  //   lightTheme: {
  //     '#solid': {
  //       fillColor: '#eeeee4',
  //     },
  //     '.shape': {
  //       fillColor: {
  //         type: 'linear-gradient',
  //         startXY: [0, 0],
  //         endXY: [100, 0],
  //         colors: [
  //           { offset: 0, color: '#FF0000' },
  //           { offset: 0.5, color: '#00FFFF' },
  //         ],
  //       },
  //     },
  // should take precedence over .shape
  // '.path': {
  //   fillColor: '#D3f3f3',
  //   strokeColor: {
  //     type: 'linear-gradient',
  //     startXY: [0, 0],
  //     endXY: [100, 0],
  //     colors: [
  //       { offset: 0, color: '#FF0000' },
  //       { offset: 0.5, color: '#00FFFF' },
  //     ],
  //   },
  // },
  //     '.polystar': {
  //       fillColor: '#D68C8C',
  //     },
  //     // should take precedence over classes
  //     '#ellipse': {
  //       fillColor: '#eeeee4',
  //     },
  //     '#rectangle': {
  //       fillColor: '#eeeee4',
  //     },
  //     '#heroText': {
  //       text: 'MEEEE',
  //     },
  //   },
  //   darkTheme: {
  //     '#solid': {
  //       fillColor: '#000000',
  //     },
  //     '.shape': {
  //       fillColor: '#000000',
  //       strokeColor: '#000000',
  //     },
  //     '.path': {
  //       fillColor: '#000000',
  //     },
  //     '.polystar': {
  //       fillColor: '#000000',
  //     },
  //     '#ellipse': {
  //       fillColor: '#000000',
  //     },
  //     '#rectangle': {
  //       fillColor: '#000000',
  //     },
  //     '#heroText': {
  //       text: 'YOUUUU',
  //     },
  //   },
  // };

  // const testConfig4 = {
  //   defaultTheme: {
  //     '.color-ff0000ff': {
  //       fillColor: '#ff0000ff',
  //       shapes: ['Polystar 1'],
  //     },
  //     '.color-00ff5cff': {
  //       fillColor: '#ff0000ff',
  //       shapes: ['Rectangle 1'],
  //     },
  //     '.color-7b49ffff': {
  //       fillColor: '#ff0000ff',
  //       shapes: ['Ellipse 1'],
  //     },
  //   },
  // };
  // developer process 1
  // initialize library

  await theming.init('https://assets9.lottiefiles.com/private_files/lf30_e3ffgiai.json'); // gradients
  // await theming.init('https://assets6.lottiefiles.com/packages/lf20_viaaiv0x.json'); // gradients
  // await theming.init('https://assets10.lottiefiles.com/packages/lf20_xncpedel.json'); // no gradients
  theming.preprocessAnimation();
  const tokens = theming.availableColors();

  // // generate themeconfig file
  // const themeConfig = theming.createConfig();

  // // developer/designer process 2
  // // modify the themeconfig object
  // themeConfig['Themes'].push({ testPalette });
  // console.dir(themeConfig, { depth: null });

  // press button 1. load default Theme
  console.dir(tokens, { depth: null });

  // const lottie = theming.applyTheme(testConfig4, 'defaultTheme');
  // console.log(lottie);
});

// add metadata identifier to pre processing process
//
