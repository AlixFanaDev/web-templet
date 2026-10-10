import { createScope, type Scope } from 'animejs';
import { useEffect, useRef, type RefObject } from 'react';
import { prefersReducedMotion } from './use-reduced-motion';

/**
 * Signature of the setup function run inside an Anime.js scope.
 *
 * @param scope - the created scope; every animation created inside `scope.add`
 *                is registered for automatic revert.
 */
export type AnimeScopeSetup = (scope: Scope) => void | (() => void);

/**
 * Wraps `anime.createScope({ root })` in a React effect.
 *
 * Every section component uses this so that:
 *  - animations are scoped to the section's DOM subtree (selectors resolve
 *    inside `root`),
 *  - `scope.revert()` runs on unmount / Fast Refresh → timelines, scroll
 *    observers and styles are torn down, leaving no orphan animations,
 *  - with `prefers-reduced-motion` the setup is skipped entirely, so sections
 *    simply render in their final, fully visible state (see the reduced-motion
 *    guard in `globals.css`).
 *
 * @param ref      RefObject to the section root element.
 * @param setupFn  Animation setup, called once after mount.
 * @param ready    Optional gate (e.g. desktop-only layouts) — skip setup while false.
 * @param deps     Extra dependencies (e.g. `[isDesktop]`) — flipping one reverts
 *                 the whole scope and re-creates the animations cleanly.
 */
export function useAnimeScope(
  ref: RefObject<HTMLElement | null>,
  setupFn: AnimeScopeSetup,
  ready: boolean = true,
  deps: readonly unknown[] = [],
): void {
  const setupRef = useRef(setupFn);
  setupRef.current = setupFn;

  useEffect(() => {
    const root = ref.current;
    if (!root || !ready) return;
    if (prefersReducedMotion()) return;

    // `createScope` accepts a React ref directly (ScopeParams.root: ReactRef).
    const scope = createScope({ root });

    // `scope.add(cb)` executes the callback immediately with the scope as the
    // active scope context, so every animate()/createTimeline() created inside
    // is tracked. Any cleanup the setup function returns is invoked by
    // `scope.revert()` before animations are reverted.
    scope.add((s) => setupRef.current(s as Scope));

    return () => {
      scope.revert();
    };
  }, [ref, ready, ...deps]);
}
