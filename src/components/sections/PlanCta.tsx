import { animate, onScroll } from 'animejs';
import { useRef } from 'react';
import { Aurora } from '@/components/bits/Aurora';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useAnimeScope } from '@/lib/use-anime-scope';
import { useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Plan CTA band — the conversion moment.
 *
 * A calm dark panel with a low-opacity Aurora drifting on a 20s loop, grain
 * over the top, and a single block that fades up on enter.
 */
export function PlanCta() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useAnimeScope(
    ref,
    () => {
      const root = ref.current;
      if (!root) return;
      const block = root.querySelector<HTMLElement>('[data-cta-block]');
      if (!block) return;

      animate(block, {
        opacity: [0, 1],
        y: [44, 0],
        duration: 800,
        ease: 'outExpo',
        autoplay: onScroll({ target: block, enter: '75% top' }),
      });
    },
    !reduced,
  );

  return (
    <section
      ref={ref}
      id="cta"
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-indigo-night py-28 md:py-40"
    >
      <Aurora />
      <GrainOverlay />

      <div data-cta-block className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <SectionHeading
          id="cta-title"
          eyebrow="Ready to Start Planning?"
          title="Let's Create Your Perfect Moroccan Adventure"
          tone="light"
        />

        <p className="body-copy mt-7 text-sand/75">
          Whether you have a clear vision of your dream trip or need inspiration, our team is here
          to help. Tell us your interests, your travel dates, and your budget, and we&apos;ll craft
          a personalized itinerary just for you — free of charge, with no obligation.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <a href="#faq" className="btn-solid-saffron">
            Start Planning Now
          </a>
          <a href="#faq" className="btn-ghost-light">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
