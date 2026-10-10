import type { LenisOptions } from 'lenis';
import { ReactLenis } from 'lenis/react';
import { useMemo, type ReactNode } from 'react';
import { prefersReducedMotion } from './use-reduced-motion';

/**
 * Lenis runs in default mode — it scrolls the real window — so `window.scrollY`,
 * IntersectionObserver and Anime.js `onScroll()` all keep working natively.
 * No scroll container wrapping, no hijacked positions.
 */
export const LENIS_OPTIONS: LenisOptions = {
  lerp: 0.085,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.4,
  // Smooth in-page anchor navigation (nav + footer links), offset for the
  // fixed navbar height.
  anchors: { offset: -72, duration: 1.2 },
};

/**
 * App-level smooth-scroll provider.
 *
 * With `prefers-reduced-motion: reduce` Lenis smoothing is switched off
 * (`smoothWheel: false`, no lerp) so native scrolling is preserved verbatim.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const options = useMemo<LenisOptions>(() => {
    if (prefersReducedMotion()) {
      return { smoothWheel: false, lerp: 1 };
    }
    return LENIS_OPTIONS;
  }, []);

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}
