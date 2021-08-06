import React from 'react';
import { render, screen } from '@testing-library/react';
import Theming from './Theming';
const LottieTheming = require('../dist/lottie-theming.cjs');

test('Header contains correct text', () => {
  const theming = new LottieTheming();

  theming.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');

  render(<Theming />);
  const text = screen.getByText('My React and TypeScript App');
  expect(text).toBeInTheDocument();
});
