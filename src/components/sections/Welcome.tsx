import { animate, onScroll } from 'animejs';
import { useRef } from 'react';
import { BlurText } from '@/components/bits/BlurText';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { welcomePhotos } from '@/data/assets';
import { useAnimeScope } from '@/lib/use-anime-scope';
import { scrubOnScroll } from '@/lib/scroll';
import { useReducedMotion } from '@/lib/use-reduced-motion';

const PARALLAX_SPEEDS = [28, 56, 40]; // px of travel per photo, all different

/**
 * Welcome / intro — light `sand` section.
 *
 * The body resolves word-by-word from blur as it enters the viewport, and the
 * three small photos below drift at different speeds (scrubbed parallax).
 */
export function Welcome() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useAnimeScope(
    ref,
    () => {
      const root = ref.current;
      if (!root) return;

      /* ---- photo row: each image drifts at its own speed ---- */
      const photos = Array.from(root.querySelectorAll<HTMLElement>('[data-welcome-photo]'));
      photos.forEach((photo, index) => {
        const trigger = scrubOnScroll(root, { enter: 'bottom top', leave: 'top bottom' });
        if (!trigger) return;
        animate(photo, {
          y: [PARALLAX_SPEEDS[index] / 2, -PARALLAX_SPEEDS[index]],
          ease: 'linear',
          autoplay: trigger,
        });
      });

      /* ---- heading reveal on enter ---- */
      const heading = root.querySelector<HTMLElement>('[data-welcome-heading]');
      if (heading) {
        animate(heading, {
          opacity: [0, 1],
          y: [30, 0],
          duration: 900,
          ease: 'outExpo',
          autoplay: onScroll({ target: heading, enter: '85% top' }),
        });
      }
    },
    !reduced,
  );

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="welcome-title"
      className="relative bg-sand py-32 md:py-44"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <div data-welcome-heading>
          <SectionHeading
            id="welcome-title"
            eyebrow="Welcome to Musti Targui Morocco Tours"
            title="Your Journey, Our Passion"
          />
        </div>

        <div className="mt-10 flex flex-col gap-7 text-left">
          <BlurText text="Welcome to Musti Targui Morocco Tours, where every journey is crafted with heart, heritage, and an intimate knowledge of this magical land. We are not just a tour company — we are a family of Berber guides, desert experts, and storytellers who were born and raised in the very landscapes we share with you." />
          <BlurText text="When you travel with us, you don't just see Morocco. You feel it. You taste it. You breathe it. You become part of it." />
          <BlurText text="Whether you dream of riding camels across the golden dunes of Erg Chebbi at sunset, getting lost in the ancient labyrinth of Fes el-Bali, sipping mint tea with a Berber family in the High Atlas Mountains, or watching the stars appear one by one over a silent desert camp — we will make that dream a reality." />
        </div>

        <a href="#tours" className="btn-ghost-dark mt-11">
          Discover Our Story
        </a>

        {/* Photo row — three rounded snapshots drifting at different speeds */}
        <div className="mt-20 flex items-center justify-center gap-5 md:gap-8">
          {welcomePhotos.map((photo, index) => (
            <figure
              key={photo.src}
              data-welcome-photo
              className="w-28 overflow-hidden rounded-2xl shadow-card will-change-transform md:w-40"
              style={{
                // staggered offsets so the row reads as depth, not a grid
                marginTop: index === 1 ? '2rem' : 0,
              }}
            >
              <ResponsiveImage
                photo={photo}
                className="aspect-square h-auto w-full object-cover"
                sizes="(max-width: 768px) 112px, 160px"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
