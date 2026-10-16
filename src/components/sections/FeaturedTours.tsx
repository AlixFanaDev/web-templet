import { animate, onScroll } from 'animejs';
import { ArrowRight, Clock, MapPin, Wallet } from 'lucide-react';
import { useRef } from 'react';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { tours } from '@/data/tours';
import { whatsappTour } from '@/data/site';
import { useAnimeScope } from '@/lib/use-anime-scope';
import { useIsDesktop, useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Tour CTAs are in-page links by default; a "Book …" action instead opens a
 * WhatsApp chat pre-filled with the tour name, so the enquiry arrives ready to
 * answer without a booking backend.
 */
function ctaTarget(label: string, tourTitle: string) {
  if (/book/i.test(label)) {
    return { href: whatsappTour(tourTitle), external: true };
  }
  return { href: '#cta', external: false };
}

/**
 * Featured tours — the core product section.
 *
 * Desktop: a sticky-stacking card deck. Each card pins at `top: 12vh` and,
 * as the next card slides over it, is scrubbed into a slight scale-down + dim
 * — the signature scroll moment of the page.
 *
 * Mobile / reduced motion: a plain vertical stack with entrance reveals
 * (no sticky, no scrub).
 */
export function FeaturedTours() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const sticky = isDesktop && !reduced;

  useAnimeScope(
    ref,
    () => {
      const root = ref.current;
      if (!root) return;

      const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-tour-card]'));

      /* --- sticky deck: each card dims/scales as the NEXT card covers it --- */
      if (sticky) {
        cards.forEach((card, index) => {
          const next = cards[index + 1];
          if (!next) return;
          const trigger = onScroll({
            target: next,
            enter: 'bottom top',
            leave: '14vh top',
            sync: true,
          });
          animate(card, {
            scale: [1, 0.94],
            filter: ['brightness(1)', 'brightness(0.62)'],
            ease: 'linear',
            autoplay: trigger,
          });
        });
      }

      /* --- entrance: image unwinds from 1.15, card rises --- */
      cards.forEach((card) => {
        const image = card.querySelector<HTMLElement>('[data-tour-image]');
        animate(card, {
          opacity: [0, 1],
          // Sticky cards must not carry an entrance transform — the scrubbed
          // scale animation owns transform on those.
          ...(sticky ? {} : { y: [48, 0] }),
          duration: 900,
          ease: 'outExpo',
          autoplay: onScroll({ target: card, enter: '85% top' }),
        });
        if (image) {
          animate(image, {
            scale: [1.15, 1],
            duration: 1200,
            ease: 'outExpo',
            autoplay: onScroll({ target: card, enter: '85% top' }),
          });
        }
      });

      /* --- section header --- */
      const header = root.querySelector<HTMLElement>('[data-tours-header]');
      if (header) {
        animate(header, {
          opacity: [0, 1],
          y: [30, 0],
          duration: 900,
          ease: 'outExpo',
          autoplay: onScroll({ target: header, enter: '85% top' }),
        });
      }

      /* --- "View All Tours" link --- */
      const allLink = root.querySelector<HTMLElement>('[data-tours-all]');
      if (allLink) {
        animate(allLink, {
          opacity: [0, 1],
          duration: 700,
          ease: 'outExpo',
          autoplay: onScroll({ target: allLink, enter: '92% top' }),
        });
      }
    },
    !reduced,
    [sticky],
  );

  return (
    <section
      ref={ref}
      id="tours"
      aria-labelledby="tours-title"
      className="relative bg-sand py-28 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div data-tours-header>
          <SectionHeading
            id="tours-title"
            eyebrow="Our Most Popular Tours"
            title="Handcrafted Itineraries for Every Dream"
          />
        </div>

        <div className="mt-16 flex flex-col gap-10 md:gap-0">
          {tours.map((tour, index) => {
            const primary = ctaTarget(tour.ctas[0], tour.title);
            const secondary = tour.ctas[1] ? ctaTarget(tour.ctas[1], tour.title) : null;
            return (
            <article
              key={tour.id}
              data-tour-card
              className={
                sticky
                  ? `sticky top-[12vh] overflow-hidden rounded-2xl border border-ink/8 bg-sand-deep shadow-card will-change-transform ${
                      index > 0 ? 'mt-[10vh]' : ''
                    }`
                  : `overflow-hidden rounded-2xl border border-ink/8 bg-sand-deep shadow-card`
              }
              style={sticky ? { zIndex: index + 1 } : undefined}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image */}
                <div className="relative h-56 overflow-hidden md:h-auto md:min-h-[30rem]">
                  <ResponsiveImage
                    photo={tour.image}
                    className="absolute inset-0 h-full w-full object-cover"
                    imgProps={{ 'data-tour-image': '' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-5 p-7 md:p-10">
                  <span className="inline-flex w-fit rounded-full bg-saffron/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-indigo-night">
                    {tour.badge}
                  </span>

                  <h3 className="font-display text-2xl font-medium leading-tight text-ink md:text-[1.75rem]">
                    {tour.title}
                  </h3>

                  <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-sand-muted">
                    <li className="flex items-center gap-1.5">
                      <Clock size={14} aria-hidden="true" className="text-clay-deep" />
                      {tour.duration}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <MapPin size={14} aria-hidden="true" className="text-clay-deep" />
                      Departure: {tour.departure}
                    </li>
                    <li className="flex items-center gap-1.5 font-medium text-clay-deep">
                      <Wallet size={14} aria-hidden="true" />
                      {tour.price}
                    </li>
                  </ul>

                  <ul className="flex flex-wrap gap-2" aria-label="Highlights">
                    {tour.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="rounded-full border border-clay-deep/30 px-3 py-1 text-[12px] font-medium text-clay-deep"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <p className="text-[15px] leading-relaxed text-sand-muted">{tour.body}</p>

                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={primary.href}
                      {...(primary.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="btn bg-clay-deep text-sand hover:bg-saffron hover:text-indigo-night"
                    >
                      {tour.ctas[0]}
                    </a>
                    {secondary && (
                      <a
                        href={secondary.href}
                        {...(secondary.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="btn-ghost-dark"
                      >
                        {tour.ctas[1]}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center" data-tours-all>
          <a href="#destinations" className="link-arrow">
            View All Tours
            <span className="arrow" aria-hidden="true">
              <ArrowRight size={17} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
