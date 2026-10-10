import { useEffect, useState } from 'react';

/**
 * Tracks the user's `prefers-reduced-motion` setting reactively.
 *
 * Every animation in this project should consult this hook:
 *  - reduced → set final states instantly, disable scroll-scrubbed timelines,
 *    disable Lenis smoothing and marquee auto-scroll.
 *  - not reduced → full cinematic motion.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** One-off check for non-React code paths (timelines created outside components). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Breakpoint helper: returns true when the viewport is at or above `md` (768px).
 * Pinned / sticky / horizontal-scroll sections are desktop-only per the brief.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 768px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(min-width: 768px)');
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

/**
 * Parallax strength multiplier per viewport class:
 * desktop 1 → tablet ×0.5 → mobile ×0.2 (brief: −50% tablet, −80% mobile).
 */
export function useParallaxFactor(): number {
  const [factor, setFactor] = useState(1);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const tablet = window.matchMedia('(min-width: 768px)');
    const update = () => setFactor(desktop.matches ? 1 : tablet.matches ? 0.5 : 0.2);
    update();
    desktop.addEventListener('change', update);
    tablet.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      tablet.removeEventListener('change', update);
    };
  }, []);

  return factor;
}
