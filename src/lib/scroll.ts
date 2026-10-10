import { onScroll, type ScrollObserver } from 'animejs';

/**
 * Shared scroll triggers for section reveals.
 *
 * Anime.js `onScroll()` defaults to a `'play pause'` sync: the linked
 * animation plays when the target enters the threshold and pauses if the user
 * scrolls away before it completes. Created inside a `useAnimeScope` setup,
 * every observer is registered with the scope and reverted on unmount.
 */

/** Plays once when `target` enters the viewport (default: top crosses 80%). */
export function revealOnEnter(
  target: HTMLElement | null | undefined,
  enter: string = '80% top',
): ScrollObserver | undefined {
  if (!target) return undefined;
  return onScroll({ target, enter });
}

/**
 * Scrubbed (linear, 1:1 with scroll) observer for parallax / pinned motion —
 * `sync: true` seeks the linked timeline between `enter` and `leave`.
 */
export function scrubOnScroll(
  target: HTMLElement | null | undefined,
  options: { enter?: string; leave?: string; axis?: 'x' | 'y' } = {},
): ScrollObserver | undefined {
  if (!target) return undefined;
  return onScroll({
    target,
    enter: options.enter ?? 'bottom top',
    leave: options.leave ?? 'top bottom',
    axis: options.axis ?? 'y',
    sync: true,
  });
}
