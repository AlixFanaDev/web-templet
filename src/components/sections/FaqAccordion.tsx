import { useRef } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { Accordion } from '@/components/twentyone/accordion';
import { faqs } from '@/data/faqs';
import { site, telHref, whatsapp } from '@/data/site';
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

          {/* Answers exhausted? Hand the visitor straight to a human. */}
          <div className="mt-14 flex flex-col items-center gap-5 rounded-2xl border border-ink/8 bg-sand/70 px-6 py-8 text-center">
            <p className="font-display text-xl font-medium text-ink">
              Still have a question?
            </p>
            <p className="max-w-md text-sm leading-relaxed text-sand-muted">
              Message us on WhatsApp or give us a call — we&apos;re based in Merzouga and usually
              reply within a few hours.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-clay-deep text-sand hover:bg-saffron hover:text-indigo-night"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                Chat on WhatsApp
              </a>
              <a href={telHref} className="btn-ghost-dark">
                Call {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
