import { animate, stagger } from 'animejs';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

type Props = {
  text: string;
  as?: 'p' | 'div' | 'blockquote';
  className?: string;
  /** Per-word stagger in ms (brief: 40–80ms for text lines/words). */
  staggerMs?: number;
  /** Per-word duration in ms (brief: reveals 700–1100ms). */
  durationMs?: number;
};

/**
 * React Bits **BlurText** — Anime.js variant.
 *
 * Splits a paragraph into words and resolves each from `blur(8px) / 40%`
 * opacity to fully sharp as the block enters the middle of the viewport
 * (IntersectionObserver, one-shot — a scrubbed timeline would make body copy
 * shimmer while the reader is mid-sentence; NOTE: chose the calmer reveal).
 *
 * Under reduced motion the words render sharp immediately.
 */
export function BlurText({
  text,
  as: Tag = 'p',
  className = '',
  staggerMs = 45,
  durationMs = 850,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [armed] = useState(() => !reduced); // hide only when a timeline will resolve it

  useEffect(() => {
    if (!armed) return;
    const el = ref.current;
    if (!el) return;

    const words = Array.from(el.querySelectorAll<HTMLElement>('[data-blur-word]'));
    if (!words.length) return;

    let done = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || done) return;
          done = true;
          observer.disconnect();
          animate(words, {
            filter: ['blur(8px)', 'blur(0px)'],
            opacity: [0, 1],
            duration: durationMs,
            delay: stagger(staggerMs),
            ease: 'outExpo',
          });
        });
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [armed, staggerMs, durationMs]);

  const initialStyle = armed
    ? ({ filter: 'blur(8px)', opacity: 0 } as const)
    : undefined;

  const words = text.split(' ');

  return (
    <Tag ref={ref as never} className={`body-copy ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} data-blur-word style={initialStyle}>
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
}
