import type { FragmentAnimation } from '../types';

const FRAGMENT_DURATION = 300;
const FRAGMENT_EASING = 'ease-out';

type AnimationDef = {
  from: Keyframe;
  to: Keyframe;
};

function getAnimationKeyframes(animation: FragmentAnimation): AnimationDef {
  switch (animation) {
    case 'fade-in':
      return {
        from: { opacity: 0 },
        to: { opacity: 1 },
      };
    case 'fade-up':
      return {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
      };
    case 'fade-down':
      return {
        from: { opacity: 0, transform: 'translateY(-20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
      };
    case 'fade-left':
      return {
        from: { opacity: 0, transform: 'translateX(20px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
      };
    case 'fade-right':
      return {
        from: { opacity: 0, transform: 'translateX(-20px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
      };
    case 'grow':
      return {
        from: { opacity: 0, transform: 'scale(0.5)' },
        to: { opacity: 1, transform: 'scale(1)' },
      };
    case 'shrink':
      return {
        from: { opacity: 0, transform: 'scale(1.5)' },
        to: { opacity: 1, transform: 'scale(1)' },
      };
    case 'highlight':
      return {
        from: { backgroundColor: 'transparent' },
        to: { backgroundColor: 'rgba(255, 213, 79, 0.4)' },
      };
  }
}

function getAnimationType(el: HTMLElement): FragmentAnimation {
  return (el.dataset.tsAnimation as FragmentAnimation) || 'fade-in';
}

export class FragmentManager {
  getFragments(slide: HTMLElement): HTMLElement[] {
    const elements = slide.querySelectorAll<HTMLElement>('.ts-fragment');
    return Array.from(elements).sort((a, b) => {
      const orderA = parseInt(a.dataset.tsIndex || '0', 10);
      const orderB = parseInt(b.dataset.tsIndex || '0', 10);
      if (orderA !== orderB) return orderA - orderB;
      // Fall back to DOM order (already sorted by querySelectorAll)
      return 0;
    });
  }

  show(el: HTMLElement): void {
    const animation = getAnimationType(el);
    const { from, to } = getAnimationKeyframes(animation);

    el.classList.add('ts-fragment-visible');

    el.animate([from, to], {
      duration: FRAGMENT_DURATION,
      easing: FRAGMENT_EASING,
      fill: 'forwards',
    });
  }

  hide(el: HTMLElement): void {
    const animation = getAnimationType(el);
    const { from, to } = getAnimationKeyframes(animation);

    el.classList.remove('ts-fragment-visible');

    el.animate([to, from], {
      duration: FRAGMENT_DURATION,
      easing: FRAGMENT_EASING,
      fill: 'forwards',
    });
  }

  showAllUpTo(fragments: HTMLElement[], index: number): void {
    for (let i = 0; i <= index && i < fragments.length; i++) {
      const el = fragments[i];
      if (!el.classList.contains('ts-fragment-visible')) {
        this.show(el);
      }
    }
  }

  hideAllFrom(fragments: HTMLElement[], index: number): void {
    for (let i = index; i < fragments.length; i++) {
      const el = fragments[i];
      if (el.classList.contains('ts-fragment-visible')) {
        this.hide(el);
      }
    }
  }
}
