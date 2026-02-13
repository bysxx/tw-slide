import TailSlide, { ProgressPlugin, SlideNumberPlugin, OverviewPlugin } from '../src/index';

const deck = new TailSlide({
  el: '.ts-deck',
  transition: 'slide',
  transitionSpeed: 500,
  dark: true,
  hash: true,
});

deck.use(new ProgressPlugin());
deck.use(new SlideNumberPlugin());
deck.use(new OverviewPlugin());
