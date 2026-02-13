import type { TailSlidePlugin, TailSlideAPI } from '../types';

export class SlideNumberPlugin implements TailSlidePlugin {
  readonly name = 'slideNumber';
  private el: HTMLElement | null = null;
  private deck: TailSlideAPI | null = null;
  private handler: (() => void) | null = null;

  init(deck: TailSlideAPI): void {
    this.deck = deck;

    this.el = document.createElement('div');
    this.el.className = 'ts-slide-number';
    deck.getContainer().appendChild(this.el);

    this.handler = () => this.update();
    deck.on('slide:changed', this.handler);

    // Initial update
    this.update();
  }

  destroy(): void {
    if (this.handler && this.deck) {
      this.deck.off('slide:changed', this.handler);
    }
    this.el?.remove();
    this.el = null;
    this.deck = null;
    this.handler = null;
  }

  private update(): void {
    if (!this.el || !this.deck) return;
    const { currentSlide, totalSlides } = this.deck.getState();
    this.el.textContent = `${currentSlide + 1} / ${totalSlides}`;
  }
}
