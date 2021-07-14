import { LottieTheming } from './lottie-theming.esm.js';

async function startThemer() {
  let themer = new LottieTheming();
  let data = await themer.init('/demo-lottie.json');
  themer.tokenize();
}
