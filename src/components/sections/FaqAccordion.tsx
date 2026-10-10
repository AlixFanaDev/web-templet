import { useRef } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/twentyone/accordion';
import { faqs } from '@/data/faqs';
import { useAnimeScope } from '@/lib/use-anime-scope';
import { animate } from 'animejs';
import { onScroll } from 'animejs';
import { useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * FAQ — light `sand-deep` panel with the 21st.dev-style accordion animated by
 * Anime.js (measured height 0 ↔ scrollHeight, 450ms outExpo, chevron rotating
 * in the same timeline).
 */
export function FaqAccordion() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useAnimeScope(
    ref,
    () => {
      const root = ref.current;
      if (!root) return;
      const header = root.querySelector<HTMLElement>('[data-faq-header]');
      const list = root.querySelector<HTMLElement>('[data-faq-list]');
      if (!header || !list) return;

      animate(header, {
        opacity: [0, 1],
        y: [30, 0],
        duration: 900,
        ease: 'outExpo',
        autoplay: onScroll({ target: header, enter: '85% top' }),
      });

      animate(list, {
        opacity: [0, 1],
        y: [36, 0],
        duration: 900,
        ease: 'outExpo',
        autoplay: onScroll({ target: list, enter: '85% top' }),
      });
    },
    !reduced,
  );

  return (
    <section
      ref={ref}
      id="faq"
      aria-labelledby="faq-title"
      className="relative bg-sand-deep py-28 md:py-36"
    >
      <div className="mx-auto max-w-3xl px-6">
        <div data-faq-header>
          <SectionHeading
            id="faq-title"
            eyebrow="Frequently Asked Questions"
            title="Everything You Need to Know Before You Travel"
          />
        </div>

        <div data-faq-list className="mt-12">
          {/* NOTE: the first item opens by default so the interaction is
              discoverable; single-open behaviour keeps the column calm. */}
          <Accordion items={faqs} defaultOpenId={faqs[0].id} />
        </div>
      </div>
    </section>
  );
}
