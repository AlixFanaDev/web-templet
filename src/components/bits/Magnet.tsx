import { createAnimatable, createSpring } from 'animejs';
import { useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

type Props = {
  children: ReactNode;
  /** How far the element is pulled toward the cursor, in px (0–1 strength). */
  strength?: number;
  className?: string;
};

/**
 * React Bits **Magnet** — Anime.js variant.
 *
 * Wraps a button/CTA and pulls it gently toward the cursor on hover using a
 * reusable `createAnimatable` instance (one retargetable animation per axis →
 * no allocation per pointermove, always 60fps).
 *
 * Disabled entirely under reduced motion, for coarse pointers, and when the
 * element leaves the hover zone it springs back to rest.
 */
export function Magnet({ children, strength = 0.32, className = '' }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    // Magnetic pull is a pointer-only affordance.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const spring = createSpring({ stiffness: 90, damping: 18 });
    const mover = createAnimatable(inner, {
      x: { duration: 420, ease: spring },
      y: { duration: 420, ease: spring },
    });

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (event.clientY - (rect.top + rect.height / 2)) * strength;
      mover.x(dx);
      mover.y(dy);
    };

    const onLeave = () => {
      mover.x(0);
      mover.y(0);
    };

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      mover.revert();
    };
  }, [strength, reduced]);

  return (
    <span ref={wrapRef} className={`inline-block ${className}`}>
      <span ref={innerRef} className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  );
}
