import { animate, onScroll, stagger } from 'animejs';
import { Star } from 'lucide-react';
import { useRef } from 'react';
import { GradualBlur } from '@/components/bits/GradualBlur';
import { Marquee } from '@/components/bits/Marquee';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TestimonialCard } from '@/components/twentyone/testimonial';
import { shortQuotes, testimonials } from '@/data/testimonials';
import { useAnimeScope } from '@/lib/use-anime-scope';
import { useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Testimonials — two marquee rows gliding in opposite directions (55s,
 * pause on hover), then a compact trust bar.
 *
 * Base card: 21st.dev testimonial component, restyled for the design system.
 */
export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useAnimeScope(
    ref,
    () => {
      const root = ref.current;
      if (!root) return;

      const header = root.querySelector<HTMLElement>('[data-reviews-header]');
      const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-review-row]'));
      const bar = root.querySelector<HTMLElement>('[data-reviews-bar]');

      if (header) {
        animate(header, {
          opacity: [0, 1],
          y: [30, 0],
          duration: 900,
          ease: 'outExpo',
          autoplay: onScroll({ target: header, enter: '85% top' }),
        });
      }

      if (rows.length) {
        animate(rows, {
          opacity: [0, 1],
          y: [36, 0],
          duration: 900,
          delay: stagger(140),
          ease: 'outExpo',
          autoplay: onScroll({ target: rows[0], enter: '75% top' }),
        });
      }

      if (bar) {
        animate(bar, {
          opacity: [0, 1],
          y: [24, 0],
          duration: 800,
          ease: 'outExpo',
          autoplay: onScroll({ target: bar, enter: '90% top' }),
        });
      }
    },
    !reduced,
  );

  return (
    <section
      ref={ref}
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative overflow-hidden bg-sand py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div data-reviews-header>
          <SectionHeading
            id="reviews-title"
            eyebrow="What Our Guests Say"
            title="Real Reviews from Real Travellers"
          />
        </div>
      </div>

      {/* Row 1 — long quote cards, travelling left */}
      <div data-review-row className="relative mt-14">
        <Marquee
          duration={55}
          direction="left"
          label="Long-form guest reviews"
          items={testimonials.map((t) => (
            <div className="mr-6" key={t.id}>
              <TestimonialCard
                title={t.title}
                quote={t.quote}
                name={t.name}
                country={t.country}
              />
            </div>
          ))}
        />
        <GradualBlur side="left" width="w-20 md:w-32" />
        <GradualBlur side="right" width="w-20 md:w-32" />
      </div>

      {/* Row 2 — short pull-quotes, travelling right */}
      <div data-review-row className="relative mt-6">
        <Marquee
          duration={55}
          direction="right"
          label="Short guest pull quotes"
          items={shortQuotes.map((q) => (
            <div className="mr-5" key={q.id}>
              <TestimonialCard title={q.title} name={q.name} country={q.country} variant="short" />
            </div>
          ))}
        />
        <GradualBlur side="left" width="w-16 md:w-24" />
        <GradualBlur side="right" width="w-16 md:w-24" />
      </div>

      {/* Trust bar */}
      <div
        data-reviews-bar
        className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-center gap-5 border-t border-ink/10 px-6 pt-9 md:flex-row md:justify-between md:px-10"
      >
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-5">
          <span className="flex items-center gap-2 font-display text-lg font-medium text-ink">
            Tripadvisor
          </span>
          <span className="flex items-center gap-1 text-saffron" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
            ))}
          </span>
          <span className="text-sm font-medium text-sand-muted">5.0 · Based on 200+ reviews</span>
        </div>

        <a href="#reviews" className="btn-ghost-dark">
          Read More Reviews
        </a>
      </div>
    </section>
  );
}
