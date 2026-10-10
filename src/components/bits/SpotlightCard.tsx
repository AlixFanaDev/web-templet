import { animate, utils } from 'animejs';
import { useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

type Props = {
  children: ReactNode;
  className?: string;
  /** Spotlight tint — defaults to a saffron glow. */
  tint?: string;
  /** Forwarded to the card element (e.g. `data-reason-card` for timelines). */
  'data-reason-card'?: string;
  'data-reveal'?: string;
};

/**
 * React Bits **SpotlightCard** — Anime.js variant.
 *
 * A soft radial light rides under the cursor:
 *  - position is applied with `utils.set()` (transform only → compositor
 *    friendly, no layout work, no animation object churn per pointermove),
 *  - opacity is a small `animate()` fade in/out (260ms outExpo).
 *
 * Purely decorative: it is `pointer-events: none`, hidden from assistive tech,
 * and skipped entirely under reduced motion.
 */
export function SpotlightCard({
  children,
  className = '',
  tint,
  'data-reason-card': dataReasonCard,
  'data-reveal': dataReveal,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const tintColor = tint ?? 'rgba(224, 168, 62, 0.16)';

  useEffect(() => {
    if (reduced) return;
    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;

    utils.set(spot, { opacity: 0, x: 0, y: 0 });

    const onEnter = () => {
      animate(spot, { opacity: 1, duration: 260, ease: 'outExpo' });
    };

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      utils.set(spot, {
        x: event.clientX - rect.left - rect.width / 2,
        y: event.clientY - rect.top - rect.height / 2,
      });
    };

    const onLeave = () => {
      animate(spot, { opacity: 0, duration: 320, ease: 'outExpo' });
    };

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);

    return () => {
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
      // Inline styles are discarded with the element on unmount; the scope
      // revert (when used inside one) cleans the rest.
    };
  }, [reduced]);

  return (
    <div
      ref={cardRef}
      data-reason-card={dataReasonCard}
      data-reveal={dataReveal}
      className={`relative overflow-hidden ${className}`}
    >
      <span
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[280px] w-[280px] rounded-full opacity-0 blur-2xl will-change-transform"
        style={{
          background: `radial-gradient(circle, ${tintColor} 0%, transparent 70%)`,
          transform: 'translate3d(0,0,0)',
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
