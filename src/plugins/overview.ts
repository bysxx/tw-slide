import type { TailSlidePlugin, TailSlideAPI } from '../types';

export class OverviewPlugin implements TailSlidePlugin {
  readonly name = 'overview';
  private deck: TailSlideAPI | null = null;
  private wrapper: HTMLElement | null = null;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;

  init(deck: TailSlideAPI): void {
    this.deck = deck;

    this.keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'o' || e.key === 'O') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        this.toggle();
      }
    };
    document.addEventListener('keydown', this.keyHandler);

    this.clickHandler = (e: MouseEvent) => {
      if (!deck.getState().isOverview) return;
      const slide = (e.target as HTMLElement).closest('.ts-slide') as HTMLElement | null;
      if (!slide) return;
      const slides = deck.getSlides();
      const index = slides.indexOf(slide);
      if (index === -1) return;
      deck.goTo(index);
      deck.toggleOverview();
    };
    deck.getContainer().addEventListener('click', this.clickHandler);
  }

  destroy(): void {
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
    if (this.clickHandler && this.deck) {
      this.deck.getContainer().removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
    this.unwrapSlides();
    this.deck = null;
  }

  private toggle(): void {
    if (!this.deck) return;
    const isOverview = this.deck.getState().isOverview;

    if (!isOverview) {
      this.wrapSlides();
    } else {
      this.unwrapSlides();
    }

    this.deck.toggleOverview();
  }

  private wrapSlides(): void {
    if (!this.deck || this.wrapper) return;
    const container = this.deck.getContainer();
    const slides = container.querySelectorAll<HTMLElement>(':scope > .ts-slide');

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'ts-slides-container';

    slides.forEach((slide) => this.wrapper!.appendChild(slide));
    container.appendChild(this.wrapper);
  }

  private unwrapSlides(): void {
    if (!this.wrapper || !this.deck) return;
    const container = this.deck.getContainer();
    const slides = this.wrapper.querySelectorAll<HTMLElement>('.ts-slide');

    slides.forEach((slide) => container.appendChild(slide));
    this.wrapper.remove();
    this.wrapper = null;
  }
}
