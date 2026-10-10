import { animate } from 'animejs';
import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export type AccordionItem = {
  id: string;
  question: string;
  answer: string;
};

type Props = {
  items: AccordionItem[];
  /** Controlled single-open state; pass `undefined` for uncontrolled start. */
  defaultOpenId?: string;
  className?: string;
};

/**
 * 21st.dev **Accordion** base, animated with Anime.js.
 *
 * - Body open/close animates the measured `scrollHeight` (the sanctioned
 *   exception to the transform/opacity rule) over 450ms `outExpo`.
 * - The chevron rotates 180° inside the same timeline.
 * - Single-open by default so the FAQ reads as a calm, focused column.
 *   NOTE: the brief doesn't specify single vs multi open — single-open was
 *   chosen because it keeps the page compact and premium.
 * - Reduced motion toggles instantly with no animation.
 * - Semantic headings + `aria-expanded` / `aria-controls` / `aria-labelledby`
 *   wire-up per the WAI-ARIA accordion pattern.
 */
export function Accordion({ items, defaultOpenId, className = '' }: Props) {
  const baseId = useId();
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const bodyRefs = useRef<Record<string, HTMLElement | null>>({});
  const animationRefs = useRef<Record<string, ReturnType<typeof animate> | null>>({});

  // Instant toggle under reduced motion (height is driven by CSS below).
  const toggle = (id: string) => {
    const nextOpen = openId === id ? null : id;

    if (reduced) {
      setOpenId(nextOpen);
      return;
    }

    const closing = openId;
    if (closing) {
      const el = bodyRefs.current[closing];
      if (el) {
        const chevron = el.parentElement?.querySelector<HTMLElement>('[data-chevron]');
        animationRefs.current[closing]?.revert();
        animationRefs.current[closing] = animate(el, {
          height: [el.scrollHeight, 0],
          duration: 450,
          ease: 'outExpo',
          onComplete: () => {
            el.style.height = '0px';
          },
        });
        if (chevron) {
          animate(chevron, { rotate: 0, duration: 450, ease: 'outExpo' });
        }
      }
    }

    if (nextOpen) {
      const el = bodyRefs.current[nextOpen];
      if (el) {
        const chevron = el.parentElement?.querySelector<HTMLElement>('[data-chevron]');
        const target = el.scrollHeight;
        animationRefs.current[nextOpen]?.revert();
        animationRefs.current[nextOpen] = animate(el, {
          height: [0, target],
          duration: 450,
          ease: 'outExpo',
          onComplete: () => {
            // Let the panel reflow naturally once it is open.
            el.style.height = 'auto';
          },
        });
        if (chevron) {
          animate(chevron, { rotate: 180, duration: 450, ease: 'outExpo' });
        }
      }
    }

    setOpenId(nextOpen);
  };

  // Reset any running animation when the component unmounts / items change.
  useEffect(() => {
    return () => {
      Object.values(animationRefs.current).forEach((a) => a?.revert());
    };
  }, []);

  // On mount, sync heights for the default-open panel (it renders at height:auto).
  useEffect(() => {
    if (reduced || !defaultOpenId) return;
    const el = bodyRefs.current[defaultOpenId];
    if (el) el.style.height = 'auto';
  }, []);

  return (
    <div className={`divide-y divide-ink/10 border-y border-ink/10 ${className}`.trim()}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id} className="py-1">
            <h3>
              <button
                id={triggerId}
                type="button"
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span className="font-display text-lg font-medium leading-snug text-ink md:text-xl">
                  {item.question}
                </span>
                <ChevronDown
                  data-chevron
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 text-clay"
                  style={
                    reduced
                      ? { transform: isOpen ? 'rotate(180deg)' : 'none' }
                      : { transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }
                  }
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              ref={(el) => {
                bodyRefs.current[item.id] = el;
              }}
              className="overflow-hidden"
              style={{
                height: reduced ? (isOpen ? 'auto' : 0) : isOpen ? 'auto' : 0,
              }}
            >
              <p className="body-copy pb-6 pr-8 text-sand-muted">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
