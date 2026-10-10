import { animate } from 'animejs';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

type Props = {
  /** The final number, e.g. 5000 */
  value: number;
  /** Prefix shown before the number, e.g. "€" */
  prefix?: string;
  /** Suffix shown after the number, e.g. "+" */
  suffix?: string;
  /** Decimal places (e.g. 1 → "5.0") */
  decimals?: number;
  durationMs?: number;
  className?: string;
  /** Accessible text — announced once with the final value, never counting. */
  srLabel?: string;
};

const formatValue = (v: number, decimals: number, suffix: string): string => {
  const rounded = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
  const [int, dec] = rounded.split('.');
  const withSeparators = Number(int).toLocaleString('en-US');
  return dec ? `${withSeparators}.${dec}` : withSeparators + suffix;
};

/**
 * React Bits **CountUp** — Anime.js variant.
 *
 * Counts up once when scrolled into view (IntersectionObserver → `animate` on
 * a plain proxy object, 1600ms outExpo), writing into `textContent` so no React
 * re-render happens during the count. The final value is mirrored in an
 * `aria-label`, so screen readers get the real number, not the animation.
 *
 * Under reduced motion the final value renders immediately.
 */
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs = 1600,
  className = '',
  srLabel,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [finalText] = useState(() =>
    prefix + formatValue(value, decimals, decimals > 0 ? '' : suffix),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.textContent = finalText;
      return;
    }

    // Start at zero only once we know we can animate to the final value.
    el.textContent = prefix + formatValue(0, decimals, decimals > 0 ? '' : suffix);

    const counter = { v: 0 };
    let animation: ReturnType<typeof animate> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          animation = animate(counter, {
            v: value,
            duration: durationMs,
            ease: 'outExpo',
            onUpdate: () => {
              el.textContent = prefix + formatValue(counter.v, decimals, decimals > 0 ? '' : suffix);
            },
            onComplete: () => {
              el.textContent = finalText;
            },
          });
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      animation?.revert();
      el.textContent = finalText;
    };
  }, [reduced, value, prefix, suffix, decimals, durationMs, finalText]);

  return (
    <>
      <span ref={ref} className={className} aria-hidden="true">
        {finalText}
      </span>
      {/* Screen readers always get the final value — never the counting state. */}
      <span className="sr-only">{srLabel ?? finalText}</span>
    </>
  );
}
