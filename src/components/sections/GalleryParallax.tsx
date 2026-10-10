import { animate, onScroll, stagger } from 'animejs';
import { useRef } from 'react';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { galleryPhotos } from '@/data/assets';
import { useAnimeScope } from '@/lib/use-anime-scope';
import { useParallaxFactor, useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Column distribution for the masonry grid — heights vary per slot so the
 * three columns read as a hand-laid collage, not a table.
 */
const COLUMNS = [
  { speed: -60, items: [galleryPhotos[0], galleryPhotos[2]] },
  { speed: -120, items: [galleryPhotos[1], galleryPhotos[6], galleryPhotos[4]] },
  { speed: -180, items: [galleryPhotos[3], galleryPhotos[5]] },
];

/**
 * Gallery parallax — full-bleed image interlude on `indigo-night`.
 *
 * Each of the three masonry columns scrolls at its own speed (−60 / −120 /
 * −180px, scrubbed 1:1 with `onScroll({ sync: true })`, halved on tablet and
 * reduced to 20% on mobile), while images reveal with a clip-path wipe
 * (inset 100% → 0, 1200ms outExpo, 120ms stagger).
 */
export function GalleryParallax() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const factor = useParallaxFactor();

  useAnimeScope(
    ref,
    () => {
      const root = ref.current;
      if (!root) return;

      /* ---- column parallax (scrubbed) ---- */
      const columns = Array.from(root.querySelectorAll<HTMLElement>('[data-gallery-col]'));
      columns.forEach((column) => {
        const speed = Number(column.dataset.speed ?? '0') * factor;
        if (!speed) return;
        const observer = onScroll({
          target: root,
          enter: 'bottom top',
          leave: 'top bottom',
          sync: true,
        });
        animate(column, {
          y: [speed / 2, -speed / 2],
          ease: 'linear',
          autoplay: observer,
        });
      });

      /* ---- clip-path reveal ---- */
      const images = Array.from(root.querySelectorAll<HTMLElement>('[data-gallery-img]'));
      if (images.length) {
        animate(images, {
          clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
          duration: 1200,
          delay: stagger(120),
          ease: 'outExpo',
          autoplay: onScroll({ target: images[0], enter: '75% top' }),
        });
      }

      /* ---- pull quote ---- */
      const quote = root.querySelector<HTMLElement>('[data-gallery-quote]');
      if (quote) {
        animate(quote, {
          opacity: [0, 1],
          y: [24, 0],
          duration: 1100,
          ease: 'outExpo',
          autoplay: onScroll({ target: quote, enter: '80% top' }),
        });
      }
    },
    !reduced,
    [factor],
  );

  // NOTE: on mobile the parallax still runs (at 20% strength) — the brief
  // only excludes *pinned / sticky / horizontal* sections below md.

  return (
    <section
      ref={ref}
      aria-label="Morocco in photographs"
      className="relative overflow-hidden bg-indigo-night py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-6 md:px-8">
        {COLUMNS.map((column, columnIndex) => (
          <div
            key={columnIndex}
            data-gallery-col
            data-speed={column.speed}
            className={`flex flex-col gap-4 will-change-transform md:gap-6 ${
              columnIndex === 2 ? 'hidden md:flex' : ''
            }`}
          >
            {column.items.map((photo, index) => (
              <figure
                key={photo.src}
                data-gallery-img
                className={`overflow-hidden rounded-2xl ${
                  columnIndex === 1 && index === 0 ? 'mt-8 md:mt-14' : ''
                }`}
                style={reduced ? undefined : { clipPath: 'inset(100% 0% 0% 0%)' }}
              >
                <ResponsiveImage
                  photo={photo}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </figure>
            ))}
          </div>
        ))}
      </div>

      {/* Single centred pull quote */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 40% at 50% 50%, rgba(16,25,46,0.82) 0%, rgba(16,25,46,0.35) 60%, rgba(16,25,46,0) 100%)',
          }}
        />
        <p
          data-gallery-quote
          className="relative max-w-3xl text-center font-display text-3xl italic leading-tight text-sand md:text-5xl"
        >
          Morocco is not a destination. It&apos;s a feeling.
        </p>
      </div>
    </section>
  );
}
