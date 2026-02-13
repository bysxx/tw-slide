<div align="center">

<br />

# tw-slide

### Modern presentations, powered by Tailwind.

<br />

[![npm version](https://img.shields.io/npm/v/tw-slide?style=flat-square&color=3b82f6)](https://www.npmjs.com/package/tw-slide)
[![bundle size](https://img.shields.io/bundlephobia/minzip/tw-slide?style=flat-square&color=8b5cf6&label=gzip)](https://bundlephobia.com/package/tw-slide)
[![license](https://img.shields.io/npm/l/tw-slide?style=flat-square&color=6366f1)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

<br />

```
npm install tw-slide
```

</div>

<br />

## Examples

> **[Live Demos](https://bysxx.github.io/tw-slide/)**

| Example | Transition | Link |
|---|---|---|
| **Guide** | slide | [How to Use](https://bysxx.github.io/tw-slide/guide.html) |
| Startup Pitch | slide | [Demo](https://bysxx.github.io/tw-slide/startup-pitch.html) |
| Tech Talk | fade | [Demo](https://bysxx.github.io/tw-slide/tech-talk.html) |
| Portfolio | zoom | [Demo](https://bysxx.github.io/tw-slide/portfolio.html) |

<br />

## Features

<table>
<tr>
<td width="50%">

**Core**
- Tailwind-native styling
- 6 GPU-accelerated transitions
- 8 fragment animations
- Keyboard, touch & swipe navigation
- URL hash sync

</td>
<td width="50%">

**Extras**
- Plugin system (progress, slide numbers, overview)
- Dark / light mode
- `prefers-reduced-motion` support
- Print-ready PDF export
- TypeScript with full autocompletion

</td>
</tr>
</table>

<br />

## CDN

Use without npm — just drop these into your HTML:

```html
<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/tw-slide/dist/tailslide.umd.js"></script>

<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tw-slide/dist/tw-slide.css">
```

Or via unpkg:

```html
<script src="https://unpkg.com/tw-slide/dist/tailslide.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/tw-slide/dist/tw-slide.css">
```

Access via the `TailSlide` global:

```html
<script>
  const deck = new TailSlide.TailSlide({ dark: true });
  deck.use(new TailSlide.ProgressPlugin());
</script>
```

<br />

## Quick Start

**HTML**

```html
<div class="ts-deck ts-dark">
  <section class="ts-slide">
    <div class="ts-content text-center">
      <h1 class="text-6xl font-bold text-white">Hello, tw-slide</h1>
      <p class="text-xl text-gray-400 mt-4">Press &rarr; to continue</p>
    </div>
  </section>

  <section class="ts-slide">
    <div class="ts-content">
      <h2 class="text-4xl font-bold text-white mb-6">Fragments</h2>
      <p class="ts-fragment text-gray-300" data-ts-animation="fade-up">I appear first</p>
      <p class="ts-fragment text-gray-300" data-ts-animation="fade-up">I appear second</p>
    </div>
  </section>
</div>
```

**JavaScript**

```js
import TailSlide, {
  ProgressPlugin,
  SlideNumberPlugin,
  OverviewPlugin,
} from 'tw-slide';
import 'tw-slide/style.css';

const deck = new TailSlide({
  transition: 'slide',
  dark: true,
});

deck.use(new ProgressPlugin());
deck.use(new SlideNumberPlugin());
deck.use(new OverviewPlugin());
```

That's it. Style your slides with Tailwind and present.

<br />

## Transitions

All transitions use the **Web Animations API** for GPU-accelerated, 60fps performance.

| Transition | Description |
|:---:|---|
| `none` | Instant cut |
| `fade` | Crossfade dissolve |
| `slide` | Horizontal slide (default) |
| `zoom` | Scale in / out |
| `flip` | 3D card flip |
| `cube` | 3D cube rotation |

```js
new TailSlide({ transition: 'cube', transitionSpeed: 600 });
```

Per-slide override via `data-ts-transition`:

```html
<section class="ts-slide" data-ts-transition="zoom">...</section>
```

<br />

## Fragments

Reveal content step by step within a slide.

```html
<p class="ts-fragment" data-ts-animation="fade-up">Step 1</p>
<p class="ts-fragment" data-ts-animation="grow">Step 2</p>
<p class="ts-fragment" data-ts-animation="highlight">Step 3</p>
```

| Animation | Effect |
|:---:|---|
| `fade-in` | Opacity fade (default) |
| `fade-up` | Slide up + fade |
| `fade-down` | Slide down + fade |
| `fade-left` | Slide from right + fade |
| `fade-right` | Slide from left + fade |
| `grow` | Scale up from small |
| `shrink` | Scale down from large |
| `highlight` | Yellow background highlight |

<br />

## Configuration

```js
new TailSlide({
  el: '.ts-deck',          // container selector or element
  transition: 'slide',     // none | fade | slide | zoom | flip | cube
  transitionSpeed: 500,    // duration in ms
  easing: 'ease-in-out',   // CSS easing function
  keyboard: true,          // keyboard navigation
  touch: true,             // touch / swipe
  hash: true,              // URL hash sync
  dark: true,              // dark mode
  loop: false,             // loop slides
  autoSlide: 0,            // auto-advance ms (0 = off)
  startSlide: 0,           // starting index
});
```

<br />

## Keyboard Shortcuts

| Key | Action |
|:---:|---|
| <kbd>&rarr;</kbd> <kbd>&darr;</kbd> <kbd>Space</kbd> <kbd>N</kbd> | Next slide / fragment |
| <kbd>&larr;</kbd> <kbd>&uarr;</kbd> <kbd>P</kbd> | Previous slide / fragment |
| <kbd>Home</kbd> | First slide |
| <kbd>End</kbd> | Last slide |
| <kbd>O</kbd> | Toggle overview grid |
| <kbd>Esc</kbd> | Toggle overview grid |

<br />

## Plugins

### ProgressPlugin

Thin progress bar at the top edge.

```js
deck.use(new ProgressPlugin());
```

### SlideNumberPlugin

Current / total counter at bottom-right.

```js
deck.use(new SlideNumberPlugin());
```

### OverviewPlugin

Bird's-eye grid of all slides. Press <kbd>O</kbd> to toggle, click to navigate.

```js
deck.use(new OverviewPlugin());
```

<br />

## API

```js
deck.next();                         // next fragment or slide
deck.prev();                         // previous fragment or slide
deck.goTo(3);                        // jump to slide index
deck.getState();                     // { currentSlide, totalSlides, ... }
deck.getSlides();                    // HTMLElement[]
deck.toggleOverview();               // toggle overview mode
deck.on('slide:changed', callback);  // listen to events
deck.off('slide:changed', callback); // remove listener
deck.destroy();                      // clean up everything
```

### Events

| Event | Payload |
|---|---|
| `slide:changed` | `{ from: number, to: number }` |
| `fragment:shown` | `{ slide, fragment, element }` |
| `fragment:hidden` | `{ slide, fragment, element }` |
| `deck:ready` | `{ totalSlides }` |
| `deck:destroyed` | `{}` |
| `overview:open` | `{}` |
| `overview:close` | `{}` |

<br />

## Custom Plugins

Extend tw-slide with your own plugins:

```ts
import type { TailSlidePlugin, TailSlideAPI } from 'tw-slide';

class ConfettiPlugin implements TailSlidePlugin {
  name = 'confetti';

  init(deck: TailSlideAPI) {
    deck.on('slide:changed', ({ to }) => {
      if (to === deck.getSlides().length - 1) {
        // 🎉 last slide — fire confetti!
      }
    });
  }

  destroy() {}
}

deck.use(new ConfettiPlugin());
```

<br />

## Browser Support

Chrome, Firefox, Safari, Edge — all modern browsers with [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) support.

<br />

<div align="center">

## License

MIT &copy; [bysxx](https://github.com/bysxx)

</div>
