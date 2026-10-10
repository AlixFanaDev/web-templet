import type { ReactNode } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

type Props = {
  items: ReactNode[];
  /** Loop duration in seconds (40s trust band, 55s testimonials). */
  duration?: number;
  direction?: 'left' | 'right';
  /** Pause when hovered or focused within (handled by `.marquee-group` CSS). */
  pauseOnHover?: boolean;
  className?: string;
  /** Accessible name for the marquee region. */
  label?: string;
};

/**
 * React Bits **Marquee** — Anime.js variant (CSS transform track).
 *
 * The row is duplicated exactly once and translated −50% with a linear CSS
 * keyframe loop: compositor-only, zero JS per frame. The section's Anime.js
 * scope handles the surrounding reveals, and the loop is disabled entirely
 * under `prefers-reduced-motion`, where the items fall back to a static
 * wrapping row.
 */
export function Marquee({
  items,
  duration = 40,
  direction = 'left',
  pauseOnHover = true,
  className = '',
  label,
}: Props) {
  const reduced = useReducedMotion();
  const duplicated = [...items, ...items];
  const animationName = direction === 'left' ? 'marquee' : 'marquee-reverse';

  if (reduced) {
    return (
      <div
        className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-3 ${className}`}
        role="region"
        aria-label={label ?? 'Scrolling highlights'}
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {item}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`marquee-group relative overflow-hidden ${pauseOnHover ? '' : 'no-pause'} ${className}`}
      role="region"
      aria-label={label ?? 'Scrolling highlights'}
      data-lenis-prevent
    >
      <div
        className="marquee-track flex w-max items-center"
        style={{
          /* Longhands only — an inline `animation` shorthand would also pin
             animation-play-state and beat the pause-on-hover rule below. */
          animationName,
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {duplicated.map((item, index) => (
          <div
            key={index}
            className="flex shrink-0 items-center"
            aria-hidden={index >= items.length ? true : undefined}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
