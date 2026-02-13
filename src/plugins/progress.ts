import type { TailSlidePlugin, TailSlideAPI } from '../types';

export class ProgressPlugin implements TailSlidePlugin {
  readonly name = 'progress';
  private bar: HTMLElement | null = null;
  private deck: TailSlideAPI | null = null;
  private handler: (() => void) | null = null;

  init(deck: TailSlideAPI): void {
    this.deck = deck;

    this.bar = document.createElement('div');
    this.bar.className = 'ts-progress';
    deck.getContainer().appendChild(this.bar);

    this.handler = () => this.update();
    deck.on('slide:changed', this.handler);

    // Initial update
    this.update();
  }

  destroy(): void {
    if (this.handler && this.deck) {
      this.deck.off('slide:changed', this.handler);
    }
    this.bar?.remove();
    this.bar = null;
    this.deck = null;
    this.handler = null;
  }

  private update(): void {
    if (!this.bar || !this.deck) return;
    const { currentSlide, totalSlides } = this.deck.getState();
    const progress = totalSlides > 1 ? (currentSlide / (totalSlides - 1)) * 100 : 100;
    this.bar.style.width = `${progress}%`;
  }
}
