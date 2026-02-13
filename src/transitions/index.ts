import type { TransitionType } from '../types';

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateElement(
  el: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
): Promise<void> {
  return new Promise((resolve) => {
    const anim = el.animate(keyframes, options);
    anim.onfinish = () => resolve();
    anim.oncancel = () => resolve();
  });
}

async function transitionNone(
  from: HTMLElement | null,
  to: HTMLElement,
): Promise<void> {
  if (from) {
    from.style.opacity = '0';
    from.style.pointerEvents = 'none';
    from.classList.remove('ts-active');
  }
  to.style.opacity = '1';
  to.style.pointerEvents = 'auto';
  to.classList.add('ts-active');
}

async function transitionFade(
  from: HTMLElement | null,
  to: HTMLElement,
  speed: number,
  easing: string,
): Promise<void> {
  const promises: Promise<void>[] = [];

  to.style.opacity = '0';
  to.style.pointerEvents = 'auto';
  to.classList.add('ts-active');

  promises.push(
    animateElement(to, [{ opacity: 0 }, { opacity: 1 }], {
      duration: speed,
      easing,
      fill: 'forwards',
    }),
  );

  if (from) {
    promises.push(
      animateElement(from, [{ opacity: 1 }, { opacity: 0 }], {
        duration: speed,
        easing,
        fill: 'forwards',
      }).then(() => {
        from.style.opacity = '0';
        from.style.pointerEvents = 'none';
        from.classList.remove('ts-active');
      }),
    );
  }

  await Promise.all(promises);
  to.style.opacity = '1';
}

async function transitionSlide(
  from: HTMLElement | null,
  to: HTMLElement,
  speed: number,
  easing: string,
  direction: 'forward' | 'backward',
): Promise<void> {
  const offset = direction === 'forward' ? '100%' : '-100%';
  const exitOffset = direction === 'forward' ? '-100%' : '100%';
  const promises: Promise<void>[] = [];

  to.style.opacity = '1';
  to.style.pointerEvents = 'auto';
  to.classList.add('ts-active');

  promises.push(
    animateElement(
      to,
      [
        { transform: `translateX(${offset})`, opacity: 1 },
        { transform: 'translateX(0)', opacity: 1 },
      ],
      { duration: speed, easing, fill: 'forwards' },
    ),
  );

  if (from) {
    promises.push(
      animateElement(
        from,
        [
          { transform: 'translateX(0)', opacity: 1 },
          { transform: `translateX(${exitOffset})`, opacity: 1 },
        ],
        { duration: speed, easing, fill: 'forwards' },
      ).then(() => {
        from.style.opacity = '0';
        from.style.pointerEvents = 'none';
        from.style.transform = '';
        from.classList.remove('ts-active');
      }),
    );
  }

  await Promise.all(promises);
  to.style.transform = '';
}

async function transitionZoom(
  from: HTMLElement | null,
  to: HTMLElement,
  speed: number,
  easing: string,
  direction: 'forward' | 'backward',
): Promise<void> {
  const enterFrom = direction === 'forward' ? 'scale(0.8)' : 'scale(1.2)';
  const exitTo = direction === 'forward' ? 'scale(1.2)' : 'scale(0.8)';
  const promises: Promise<void>[] = [];

  to.style.opacity = '0';
  to.style.pointerEvents = 'auto';
  to.classList.add('ts-active');

  promises.push(
    animateElement(
      to,
      [
        { transform: enterFrom, opacity: 0 },
        { transform: 'scale(1)', opacity: 1 },
      ],
      { duration: speed, easing, fill: 'forwards' },
    ),
  );

  if (from) {
    promises.push(
      animateElement(
        from,
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: exitTo, opacity: 0 },
        ],
        { duration: speed, easing, fill: 'forwards' },
      ).then(() => {
        from.style.opacity = '0';
        from.style.pointerEvents = 'none';
        from.style.transform = '';
        from.classList.remove('ts-active');
      }),
    );
  }

  await Promise.all(promises);
  to.style.opacity = '1';
  to.style.transform = '';
}

async function transitionFlip(
  from: HTMLElement | null,
  to: HTMLElement,
  speed: number,
  easing: string,
  direction: 'forward' | 'backward',
): Promise<void> {
  const enterAngle = direction === 'forward' ? -180 : 180;
  const exitAngle = direction === 'forward' ? 180 : -180;
  const halfDuration = speed / 2;

  const deck = to.parentElement;
  if (deck) deck.style.perspective = '1200px';

  if (from) {
    await animateElement(
      from,
      [
        { transform: 'rotateY(0deg)', opacity: 1 },
        { transform: `rotateY(${exitAngle}deg)`, opacity: 0 },
      ],
      { duration: halfDuration, easing, fill: 'forwards' },
    );
    from.style.opacity = '0';
    from.style.pointerEvents = 'none';
    from.style.transform = '';
    from.classList.remove('ts-active');
  }

  to.style.pointerEvents = 'auto';
  to.classList.add('ts-active');

  await animateElement(
    to,
    [
      { transform: `rotateY(${enterAngle}deg)`, opacity: 0 },
      { transform: 'rotateY(0deg)', opacity: 1 },
    ],
    { duration: halfDuration, easing, fill: 'forwards' },
  );

  to.style.opacity = '1';
  to.style.transform = '';
}

async function transitionCube(
  from: HTMLElement | null,
  to: HTMLElement,
  speed: number,
  easing: string,
  direction: 'forward' | 'backward',
): Promise<void> {
  const deck = to.parentElement;
  if (deck) deck.style.perspective = '1200px';

  const enterRotate = direction === 'forward' ? 90 : -90;
  const exitRotate = direction === 'forward' ? -90 : 90;
  const enterZ = 'translateZ(-50vw)';
  const promises: Promise<void>[] = [];

  to.style.pointerEvents = 'auto';
  to.classList.add('ts-active');
  to.style.transformOrigin =
    direction === 'forward' ? 'left center' : 'right center';

  promises.push(
    animateElement(
      to,
      [
        {
          transform: `${enterZ} rotateY(${enterRotate}deg)`,
          opacity: 0.6,
        },
        { transform: 'translateZ(0) rotateY(0deg)', opacity: 1 },
      ],
      { duration: speed, easing, fill: 'forwards' },
    ).then(() => {
      to.style.opacity = '1';
      to.style.transform = '';
      to.style.transformOrigin = '';
    }),
  );

  if (from) {
    from.style.transformOrigin =
      direction === 'forward' ? 'right center' : 'left center';

    promises.push(
      animateElement(
        from,
        [
          { transform: 'translateZ(0) rotateY(0deg)', opacity: 1 },
          {
            transform: `${enterZ} rotateY(${exitRotate}deg)`,
            opacity: 0.6,
          },
        ],
        { duration: speed, easing, fill: 'forwards' },
      ).then(() => {
        from.style.opacity = '0';
        from.style.pointerEvents = 'none';
        from.style.transform = '';
        from.style.transformOrigin = '';
        from.classList.remove('ts-active');
      }),
    );
  }

  await Promise.all(promises);
}

export interface TransitionOptions {
  duration: number;
  easing: string;
  direction?: 'forward' | 'backward';
}

export async function applyTransition(
  from: HTMLElement | null,
  to: HTMLElement,
  type: TransitionType,
  options: TransitionOptions,
): Promise<void> {
  const effectiveType = prefersReducedMotion() ? 'none' : type;
  const { duration, easing, direction = 'forward' } = options;

  switch (effectiveType) {
    case 'none':
      return transitionNone(from, to);
    case 'fade':
      return transitionFade(from, to, duration, easing);
    case 'slide':
      return transitionSlide(from, to, duration, easing, direction);
    case 'zoom':
      return transitionZoom(from, to, duration, easing, direction);
    case 'flip':
      return transitionFlip(from, to, duration, easing, direction);
    case 'cube':
      return transitionCube(from, to, duration, easing, direction);
  }
}
