import { utils } from 'animejs';
import { useLenis } from 'lenis/react';
import { useRef, type ReactNode } from 'react';
import { LenisProvider } from '@/lib/lenis-provider';

/**
 * Fixed 2px saffron progress line pinned to the very top of the viewport.
 * Driven straight from Lenis' `progress` value with `utils.set()` — no React
 * state, no re-render per frame, transform only.
 */
function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useLenis((lenis) => {
    const el = barRef.current;
    if (!el) return;
    utils.set(el, { scaleX: lenis.progress });
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}

/**
 * Whole-app scroll wrapper:
 *  - Lenis smooth scrolling (disabled under reduced motion),
 *  - the global scroll-progress bar.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      {/* The bar is a direct read-out of scroll position, not an autoplay
          animation, so it stays visible under reduced motion too. */}
      <ScrollProgressBar />
      {children}
    </LenisProvider>
  );
}
