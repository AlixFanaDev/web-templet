import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Force a colour token; defaults inherit from the section. */
  tone?: 'muted' | 'saffron' | 'saffron-deep' | 'sand';
  className?: string;
};

const toneClass: Record<NonNullable<Props['tone']>, string> = {
  muted: 'text-sand-muted',
  saffron: 'text-saffron',
  // AA-safe gold for light backgrounds (bright saffron only reads on dark).
  'saffron-deep': 'text-saffron-deep',
  sand: 'text-sand/80',
};

/**
 * Thin uppercase micro-label — Inter 11px, 0.18em tracking — used as the
 * eyebrow above every section heading.
 */
export function EyebrowLabel({ children, tone = 'muted', className = '' }: Props) {
  return (
    <span className={`eyebrow ${toneClass[tone]} ${className}`.trim()}>{children}</span>
  );
}
