import { LottieTheming } from './lottie-theming';

test('Header contains correct text', async () => {
  const theming = new LottieTheming();

  await theming.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');
});
