import { LottieTheming } from '../dist/lottie-theming.es';

test('Header contains correct text', () => {
  const theming = new LottieTheming();

  theming.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');
});
