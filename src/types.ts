// ─── Configuration ──────────────────────────────────────────────
export type TransitionType = 'none' | 'fade' | 'slide' | 'zoom' | 'flip' | 'cube';
export type FragmentAnimation = 'fade-in' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'grow' | 'shrink' | 'highlight';
export type EasingFunction = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | string;

export interface TailSlideConfig {
  /** CSS selector or element for the deck container */
  el?: string | HTMLElement;
  /** Default transition between slides */
  transition?: TransitionType;
  /** Transition duration in ms */
  transitionSpeed?: number;
  /** Easing function for transitions */
  easing?: EasingFunction;
  /** Enable keyboard navigation */
  keyboard?: boolean;
  /** Enable hash-based URL navigation */
  hash?: boolean;
  /** Show progress bar */
  progress?: boolean;
  /** Show slide numbers */
  slideNumber?: boolean;
  /** Enable touch/swipe navigation */
  touch?: boolean;
  /** Enable click to advance */
  clickToAdvance?: boolean;
  /** Auto-slide interval in ms (0 = disabled) */
  autoSlide?: number;
  /** Loop back to first slide after last */
  loop?: boolean;
  /** Start slide index (0-based) */
  startSlide?: number;
  /** Dark mode */
  dark?: boolean;
  /** Custom CSS classes for the deck */
  deckClass?: string;
}

export const DEFAULT_CONFIG: Required<TailSlideConfig> = {
  el: '.ts-deck',
  transition: 'slide',
  transitionSpeed: 500,
  easing: 'ease-in-out',
  keyboard: true,
  hash: true,
  progress: true,
  slideNumber: true,
  touch: true,
  clickToAdvance: false,
  autoSlide: 0,
  loop: false,
  startSlide: 0,
  dark: true,
  deckClass: '',
};

// ─── State ──────────────────────────────────────────────────────
export interface DeckState {
  currentSlide: number;
  currentFragment: number;
  totalSlides: number;
  isOverview: boolean;
  isPaused: boolean;
}

// ─── Events ─────────────────────────────────────────────────────
export interface TailSlideEvents {
  'slide:changed': { from: number; to: number };
  'fragment:shown': { slide: number; fragment: number; element: HTMLElement };
  'fragment:hidden': { slide: number; fragment: number; element: HTMLElement };
  'deck:ready': { totalSlides: number };
  'deck:destroyed': {};
  'overview:open': {};
  'overview:close': {};
}

export type EventCallback<T = unknown> = (data: T) => void;

// ─── Plugin ─────────────────────────────────────────────────────
export interface TailSlidePlugin {
  name: string;
  init(deck: TailSlideAPI): void;
  destroy(): void;
}

// ─── Public API ─────────────────────────────────────────────────
export interface TailSlideAPI {
  /** Navigate to a specific slide */
  goTo(index: number): void;
  /** Go to next slide/fragment */
  next(): void;
  /** Go to previous slide/fragment */
  prev(): void;
  /** Get current state */
  getState(): DeckState;
  /** Get config */
  getConfig(): Required<TailSlideConfig>;
  /** Get the deck container element */
  getContainer(): HTMLElement;
  /** Get all slide elements */
  getSlides(): HTMLElement[];
  /** Get fragments for a specific slide */
  getFragments(slideIndex: number): HTMLElement[];
  /** Register an event listener */
  on<K extends keyof TailSlideEvents>(event: K, callback: EventCallback<TailSlideEvents[K]>): void;
  /** Remove an event listener */
  off<K extends keyof TailSlideEvents>(event: K, callback: EventCallback<TailSlideEvents[K]>): void;
  /** Register a plugin */
  use(plugin: TailSlidePlugin): void;
  /** Toggle overview mode */
  toggleOverview(): void;
  /** Destroy the instance */
  destroy(): void;
}
