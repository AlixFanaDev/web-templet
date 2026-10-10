import type { ReactNode } from 'react';
import { EyebrowLabel } from './EyebrowLabel';

type Props = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  /** alignment: centred for most sections, left where the layout needs it */
  align?: 'center' | 'left';
  tone?: 'dark' | 'light';
  className?: string;
};

/**
 * The shared section header: eyebrow label + H2 with a stable `id` that the
 * wrapping `<section aria-labelledby>` points at.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  align = 'center',
  tone = 'dark',
  className = '',
}: Props) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  const titleTone = tone === 'dark' ? 'text-ink' : 'text-sand';

  return (
    <div className={`flex flex-col gap-5 ${alignCls} ${className}`}>
      <EyebrowLabel tone={tone === 'dark' ? 'saffron-deep' : 'sand'}>{eyebrow}</EyebrowLabel>
      <h2 id={id} className={`h2-display max-w-4xl ${titleTone}`}>
        {title}
      </h2>
    </div>
  );
}
