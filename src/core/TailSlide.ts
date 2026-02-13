import type {
  TailSlideConfig,
  TailSlideAPI,
  TailSlidePlugin,
  TailSlideEvents,
  DeckState,
  EventCallback,
} from '../types';
import { DEFAULT_CONFIG } from '../types';
import { EventEmitter } from './Events';
import { StateManager } from './State';
import { Navigation } from './Navigation';
import { applyTransition } from '../transitions';
import { FragmentManager } from '../fragments';

export class TailSlide implements TailSlideAPI {
  private config: Required<TailSlideConfig>;
  private container: HTMLElement;
  private slides: HTMLElement[] = [];
  private events: EventEmitter;
  private state: StateManager;
  private navigation: Navigation | null = null;
  private plugins: TailSlidePlugin[] = [];
  private fragmentManager: FragmentManager;
  private autoSlideTimer: ReturnType<typeof setInterval> | null = null;
  private hashChangeHandler: (() => void) | null = null;

  constructor(config: TailSlideConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.events = new EventEmitter();

    // Resolve container element
    const el = this.config.el;
    const container =
      typeof el === 'string' ? document.querySelector<HTMLElement>(el) : el;

    if (!container) {
      throw new Error(`TailSlide: container "${el}" not found`);
    }

    this.container = container;
    this.container.classList.add('ts-deck');
    if (this.config.deckClass) {
      this.container.classList.add(...this.config.deckClass.split(/\s+/));
    }
    if (this.config.dark) {
      this.container.classList.add('ts-dark');
    }

    // Collect slides
    this.slides = Array.from(this.container.querySelectorAll<HTMLElement>('.ts-slide'));
    this.state = new StateManager(this.slides.length);
    this.fragmentManager = new FragmentManager();

    // Determine start slide from hash or config
    const startSlide = this.getSlideFromHash() ?? this.config.startSlide;
    this.state.currentSlide = this.clamp(startSlide);

    // Initial layout
    this.updateSlideClasses();

    // Init navigation
    this.navigation = new Navigation(this, this.config);

    // Hash navigation
    if (this.config.hash) {
      this.hashChangeHandler = () => {
        const index = this.getSlideFromHash();
        if (index !== null && index !== this.state.currentSlide) {
          this.goTo(index);
        }
      };
      window.addEventListener('hashchange', this.hashChangeHandler);
      this.syncHash();
    }

    // Auto-slide
    if (this.config.autoSlide > 0) {
      this.startAutoSlide();
    }

    this.events.emit('deck:ready', { totalSlides: this.slides.length });
  }

  // ─── Public API ────────────────────────────────────────────────

  goTo(index: number): void {
    const target = this.clamp(index);
    if (target === this.state.currentSlide) return;

    const from = this.state.currentSlide;
    const direction = target > from ? 'forward' : 'backward';

    applyTransition(
      this.slides[from],
      this.slides[target],
      this.config.transition,
      {
        duration: this.config.transitionSpeed,
        easing: this.config.easing,
        direction,
      },
    );

    this.state.currentSlide = target;
    this.state.currentFragment = -1;
    this.updateSlideClasses();
    this.syncHash();

    this.events.emit('slide:changed', { from, to: target });
  }

  next(): void {
    if (this.state.isPaused) return;

    // Try to show next fragment first
    const fragments = this.getFragments(this.state.currentSlide);
    if (fragments.length > 0) {
      const nextFrag = this.state.currentFragment + 1;
      if (nextFrag < fragments.length) {
        this.state.currentFragment = nextFrag;
        this.fragmentManager.show(fragments[nextFrag]);
        this.events.emit('fragment:shown', {
          slide: this.state.currentSlide,
          fragment: nextFrag,
          element: fragments[nextFrag],
        });
        return;
      }
    }

    // Advance to next slide
    const nextSlide = this.state.currentSlide + 1;
    if (nextSlide < this.slides.length) {
      this.goTo(nextSlide);
    } else if (this.config.loop) {
      this.goTo(0);
    }
  }

  prev(): void {
    if (this.state.isPaused) return;

    // Try to hide current fragment first
    const fragments = this.getFragments(this.state.currentSlide);
    if (fragments.length > 0 && this.state.currentFragment >= 0) {
      const frag = this.state.currentFragment;
      this.fragmentManager.hide(fragments[frag]);
      this.state.currentFragment = frag - 1;
      this.events.emit('fragment:hidden', {
        slide: this.state.currentSlide,
        fragment: frag,
        element: fragments[frag],
      });
      return;
    }

    // Go to previous slide
    const prevSlide = this.state.currentSlide - 1;
    if (prevSlide >= 0) {
      this.goTo(prevSlide);
      // Show all fragments on the previous slide
      const prevFragments = this.getFragments(prevSlide);
      prevFragments.forEach((el) => this.fragmentManager.show(el));
      this.state.currentFragment = prevFragments.length - 1;
    } else if (this.config.loop) {
      this.goTo(this.slides.length - 1);
    }
  }

  getState(): DeckState {
    return this.state.get();
  }

  getConfig(): Required<TailSlideConfig> {
    return { ...this.config };
  }

  getContainer(): HTMLElement {
    return this.container;
  }

  getSlides(): HTMLElement[] {
    return [...this.slides];
  }

  getFragments(slideIndex: number): HTMLElement[] {
    const slide = this.slides[slideIndex];
    if (!slide) return [];
    return Array.from(slide.querySelectorAll<HTMLElement>('.ts-fragment'));
  }

  on<K extends keyof TailSlideEvents>(
    event: K,
    callback: EventCallback<TailSlideEvents[K]>,
  ): void {
    this.events.on(event, callback);
  }

  off<K extends keyof TailSlideEvents>(
    event: K,
    callback: EventCallback<TailSlideEvents[K]>,
  ): void {
    this.events.off(event, callback);
  }

  use(plugin: TailSlidePlugin): void {
    this.plugins.push(plugin);
    plugin.init(this);
  }

  toggleOverview(): void {
    this.state.isOverview = !this.state.isOverview;

    if (this.state.isOverview) {
      this.container.classList.add('ts-overview');
      this.events.emit('overview:open', {});
    } else {
      this.container.classList.remove('ts-overview');
      this.events.emit('overview:close', {});
    }
  }

  destroy(): void {
    this.stopAutoSlide();
    this.navigation?.destroy();
    this.navigation = null;

    if (this.hashChangeHandler) {
      window.removeEventListener('hashchange', this.hashChangeHandler);
      this.hashChangeHandler = null;
    }

    this.plugins.forEach((p) => p.destroy());
    this.plugins = [];

    this.events.emit('deck:destroyed', {});
    this.events.removeAll();
  }

  // ─── Private ───────────────────────────────────────────────────

  private updateSlideClasses(): void {
    const current = this.state.currentSlide;

    this.slides.forEach((slide, i) => {
      slide.classList.remove('ts-active', 'ts-past', 'ts-future');
      slide.setAttribute('aria-hidden', String(i !== current));

      if (i < current) {
        slide.classList.add('ts-past');
      } else if (i === current) {
        slide.classList.add('ts-active');
      } else {
        slide.classList.add('ts-future');
      }
    });

    // Reset fragments on the current slide
    const fragments = this.getFragments(current);
    fragments.forEach((el) => this.fragmentManager.hide(el));
    this.state.currentFragment = -1;
  }

  private clamp(index: number): number {
    return Math.max(0, Math.min(index, this.slides.length - 1));
  }

  private getSlideFromHash(): number | null {
    const match = window.location.hash.match(/^#\/(\d+)$/);
    if (!match) return null;
    const index = parseInt(match[1], 10);
    return isNaN(index) ? null : index;
  }

  private syncHash(): void {
    if (!this.config.hash) return;
    const target = `#/${this.state.currentSlide}`;
    if (window.location.hash !== target) {
      history.replaceState(null, '', target);
    }
  }

  private startAutoSlide(): void {
    this.autoSlideTimer = setInterval(() => {
      if (!this.state.isPaused) {
        this.next();
      }
    }, this.config.autoSlide);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideTimer !== null) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = null;
    }
  }
}
