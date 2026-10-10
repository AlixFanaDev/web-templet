import type { CSSProperties, ReactNode } from 'react';

/**
 * 21st.dev **Bento Grid** — asymmetric grid used by the "Why Choose Us" band.
 *
 * Layout on desktop (3 columns):
 *   row 1: [hero card — spans 2 cols][tall card — spans 2 rows]
 *   row 2: [card][card]
 *   row 3: [card][wide card — spans 2 cols]
 *
 * Below `md` everything collapses to a single column in reading order.
 *
 * Install reference:
 *   npx shadcn@latest add "https://21st.dev/r/milanzc/bento-grid"
 */
export function BentoGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-fr ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export type BentoSpan = 'default' | 'wide' | 'tall' | 'wide-bottom';

const spanClass: Record<BentoSpan, string> = {
  default: '',
  wide: 'md:col-span-2',
  tall: 'md:row-span-2',
  'wide-bottom': 'md:col-span-2',
};

type ItemProps = {
  span?: BentoSpan;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  /** Allows the parent section to target items in an Anime.js timeline. */
  itemRef?: React.Ref<HTMLDivElement>;
  'data-bento-item'?: string;
};

export function BentoGridItem({
  span = 'default',
  children,
  style,
  className = '',
  itemRef,
  ...rest
}: ItemProps) {
  return (
    <div ref={itemRef} data-bento-item="" {...rest} className={spanClass[span]} style={style}>
      <div className={`h-full ${className}`}>{children}</div>
    </div>
  );
}
