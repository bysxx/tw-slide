import type { DeckState } from '../types';

export class StateManager {
  private state: DeckState;

  constructor(totalSlides: number) {
    this.state = {
      currentSlide: 0,
      currentFragment: -1,
      totalSlides,
      isOverview: false,
      isPaused: false,
    };
  }

  get(): DeckState {
    return { ...this.state };
  }

  get currentSlide(): number {
    return this.state.currentSlide;
  }

  set currentSlide(value: number) {
    this.state.currentSlide = value;
  }

  get currentFragment(): number {
    return this.state.currentFragment;
  }

  set currentFragment(value: number) {
    this.state.currentFragment = value;
  }

  get totalSlides(): number {
    return this.state.totalSlides;
  }

  set totalSlides(value: number) {
    this.state.totalSlides = value;
  }

  get isOverview(): boolean {
    return this.state.isOverview;
  }

  set isOverview(value: boolean) {
    this.state.isOverview = value;
  }

  get isPaused(): boolean {
    return this.state.isPaused;
  }

  set isPaused(value: boolean) {
    this.state.isPaused = value;
  }
}
