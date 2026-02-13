import './styles/tailslide.css';

export { TailSlide } from './core/TailSlide';
export { TailSlide as default } from './core/TailSlide';

// Plugins
export { ProgressPlugin } from './plugins/progress';
export { SlideNumberPlugin } from './plugins/slideNumber';
export { OverviewPlugin } from './plugins/overview';

// Types
export type {
  TailSlideConfig,
  TailSlideAPI,
  TailSlidePlugin,
  TailSlideEvents,
  DeckState,
  EventCallback,
  TransitionType,
  FragmentAnimation,
  EasingFunction,
} from './types';
