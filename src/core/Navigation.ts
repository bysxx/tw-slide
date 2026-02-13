import type { TailSlideAPI, TailSlideConfig } from '../types';

const SWIPE_THRESHOLD = 50;

export class Navigation {
  private deck: TailSlideAPI;
  private config: Required<TailSlideConfig>;
  private container: HTMLElement;

  private touchStartX = 0;
  private touchStartY = 0;

  private handleKeyDown: (e: KeyboardEvent) => void;
  private handleClick: (e: MouseEvent) => void;
  private handleTouchStart: (e: TouchEvent) => void;
  private handleTouchEnd: (e: TouchEvent) => void;

  constructor(deck: TailSlideAPI, config: Required<TailSlideConfig>) {
    this.deck = deck;
    this.config = config;
    this.container = deck.getContainer();

    this.handleKeyDown = this.onKeyDown.bind(this);
    this.handleClick = this.onClick.bind(this);
    this.handleTouchStart = this.onTouchStart.bind(this);
    this.handleTouchEnd = this.onTouchEnd.bind(this);

    this.bind();
  }

  private bind(): void {
    if (this.config.keyboard) {
      document.addEventListener('keydown', this.handleKeyDown);
    }

    if (this.config.clickToAdvance) {
      this.container.addEventListener('click', this.handleClick);
    }

    if (this.config.touch) {
      this.container.addEventListener('touchstart', this.handleTouchStart, {
        passive: true,
      });
      this.container.addEventListener('touchend', this.handleTouchEnd);
    }
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'n':
        e.preventDefault();
        this.deck.next();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'p':
        e.preventDefault();
        this.deck.prev();
        break;

      case 'Home':
        e.preventDefault();
        this.deck.goTo(0);
        break;

      case 'End':
        e.preventDefault();
        this.deck.goTo(this.deck.getSlides().length - 1);
        break;

      case 'Escape':
        e.preventDefault();
        this.deck.toggleOverview();
        break;
    }
  }

  private onClick(_e: MouseEvent): void {
    this.deck.next();
  }

  private onTouchStart(e: TouchEvent): void {
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  private onTouchEnd(e: TouchEvent): void {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - this.touchStartX;
    const dy = touch.clientY - this.touchStartY;

    // Only count horizontal swipes (ignore vertical scrolls)
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;

    e.preventDefault();

    if (dx < 0) {
      this.deck.next();
    } else {
      this.deck.prev();
    }
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.container.removeEventListener('click', this.handleClick);
    this.container.removeEventListener('touchstart', this.handleTouchStart);
    this.container.removeEventListener('touchend', this.handleTouchEnd);
  }
}
