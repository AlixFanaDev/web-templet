import type { ReactNode } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

type Props = {
  /** The text to reveal word-by-word inside an overflow mask. */
  text: string;
  as?: 'h1' | 'h2' | 'p' | 'span';
  className?: string;
  /** Applied to every word wrapper (use to tune mask height for descenders). */
  wordClassName?: string;
  children?: ReactNode;
};

/**
 * React Bits **SplitText** — Anime.js variant (structural).
 *
 * Splits into words, each wrapped in an `overflow-hidden` mask with an inner
 * span carrying `[data-split-word]`. The parent section's Anime.js timeline
 * animates those spans (translateY 90% → 0 with the mask doing the reveal),
 * so the hero owns the choreography while this component stays declarative.
 *
 * Words are not selectable as separate nodes by screen readers — the original
 * string is preserved as plain text inside each inner span, so the accessible
 * name of the heading is unchanged.
 */
export function SplitText({ text, as: Tag = 'h1', className = '', wordClassName = '' }: Props) {
  const words = text.split(' ');
  const reduced = useReducedMotion();
  // Hidden start-state only when motion is allowed; reduced-motion renders the
  // final state directly (no timeline ever runs to resolve a hidden state).
  const initialStyle = reduced ? undefined : ({ transform: 'translateY(90%)' } as const);

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={`inline-block overflow-hidden align-bottom pb-[0.08em] ${wordClassName}`}
          >
            <span data-split-word className="inline-block will-change-transform" style={initialStyle}>
              {word}
              {/* non-breaking trailing space keeps wrapping identical to the source string */}
              {i < words.length - 1 ? '\u00A0' : ''}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
