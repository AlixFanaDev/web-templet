import { animate, onScroll, stagger, type JSAnimation, type ScrollObserver } from 'animejs';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { destinations } from '@/data/destinations';
import { useAnimeScope } from '@/lib/use-anime-scope';
import { useIsDesktop, useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Destinations — an interactive horizontal journey.
 *
 * Desktop (md+): the section pins (sticky viewport) and the card track is
 * translated on X in 1:1 proportion to vertical scroll via Anime.js
 * `onScroll({ sync: true })`. A thin progress line fills beneath the track.
 *
 * Mobile / reduced motion: a native `overflow-x: auto` snap carousel with
 * `data-lenis-prevent` so Lenis never fights the finger.
 *
 * NOTE: the brief asks for a "dark-to-light gradient transition" into this
 * section; since the section above is light sand, the transition is rendered
 * as a soft indigo dusk veil that resolves into `--sand-deep` — the calmest
 * reading of the intent without inserting a dark band mid-page.
 */
export function Destinations() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const pinned = isDesktop && !reduced;

  // Runs the pin/scrub setup (or tears the previous run down) — re-run on
  // breakpoint and significant width changes so the math never goes stale.
  const setupPin = useCallback(
    (scopeRoot: HTMLElement) => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      const progress = progressRef.current;
      if (!track || !viewport) return () => {};

      const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (!overflow) return () => {};

      const animations: JSAnimation[] = [];
      const observers: ScrollObserver[] = [];

      const trackObserver = onScroll({
        target: scopeRoot,
        enter: 'top top',
        leave: 'bottom bottom',
        sync: true,
      });
      animations.push(
        animate(track, { x: [0, -overflow], ease: 'linear', autoplay: trackObserver }),
      );
      if (progress) {
        const progressObserver = onScroll({
          target: scopeRoot,
          enter: 'top top',
          leave: 'bottom bottom',
          sync: true,
        });
        animations.push(
          animate(progress, { scaleX: [0, 1], ease: 'linear', autoplay: progressObserver }),
        );
        observers.push(progressObserver);
      }
      observers.push(trackObserver);

      return () => {
        animations.forEach((a) => a.revert());
        observers.forEach((o) => o.revert());
      };
    },
    [],
  );

  useAnimeScope(
    ref,
    () => {
      const root = ref.current;
      if (!root) return;

      // header + entrance reveals (work at every breakpoint)
      const header = root.querySelector<HTMLElement>('[data-dest-header]');
      if (header) {
        animate(header, {
          opacity: [0, 1],
          y: [30, 0],
          duration: 900,
          ease: 'outExpo',
          autoplay: onScroll({ target: header, enter: '85% top' }),
        });
      }

      const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-dest-card]'));
      if (cards.length) {
        animate(cards, {
          opacity: [0, 1],
          y: [40, 0],
          duration: 800,
          delay: stagger(90),
          ease: 'outExpo',
          autoplay: onScroll({ target: cards[0], enter: '75% top' }),
        });
      }

      if (!pinned) return;

      let cleanup = setupPin(root);

      const onResize = () => {
        cleanup();
        cleanup = setupPin(root);
      };
      let lastWidth = window.innerWidth;
      const onWidthChange = () => {
        if (Math.abs(window.innerWidth - lastWidth) < 40) return;
        lastWidth = window.innerWidth;
        onResize();
      };
      window.addEventListener('resize', onWidthChange);

      return () => {
        window.removeEventListener('resize', onWidthChange);
        cleanup();
      };
    },
    !reduced,
    [pinned],
  );

  // Section height: viewport + horizontal travel (desktop only).
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    if (!pinned) {
      section.style.height = '';
      return;
    }
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
    section.style.height = `calc(100dvh + ${overflow}px)`;
  }, [pinned]);

  return (
    <section
      ref={ref}
      id="destinations"
      aria-labelledby="destinations-title"
      className="relative bg-sand-deep"
    >
      {/* dusk → sand-deep transition veil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            'linear-gradient(180deg, rgba(16,25,46,0.22) 0%, rgba(16,25,46,0.08) 42%, rgba(16,25,46,0) 100%)',
        }}
      />

      <div
        className={
          pinned
            ? 'sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden'
            : 'flex flex-col gap-10 py-24'
        }
      >
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10" data-dest-header>
          <SectionHeading
            id="destinations-title"
            eyebrow="Moroccan Cities You Must Visit"
            title="Discover the Diversity of Morocco"
            align="left"
          />
        </div>

        {/* Track */}
        <div
          ref={viewportRef}
          data-lenis-prevent={pinned ? undefined : ''}
          className={
            pinned
              ? 'mt-10 w-full overflow-hidden'
              : 'no-scrollbar mt-2 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4'
          }
        >
          <div
            ref={trackRef}
            className={
              pinned
                ? 'flex w-max gap-6 px-6 will-change-transform md:px-10'
                : 'contents'
            }
          >
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} pinned={pinned} />
            ))}
          </div>
        </div>

        {/* Scroll-progress line beneath the track */}
        <div className="mx-auto mt-8 w-full max-w-7xl px-6 md:px-10">
          <div className="h-px w-full bg-ink/12">
            <div
              ref={progressRef}
              className="h-px origin-left bg-clay will-change-transform"
              style={{ transform: pinned ? 'scaleX(0)' : 'scaleX(1)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DestinationCard({
  destination,
  pinned,
}: {
  destination: (typeof destinations)[number];
  pinned: boolean;
}) {
  return (
    <article
      data-dest-card
      className={`group relative w-[min(84vw,26rem)] shrink-0 snap-start overflow-hidden rounded-2xl border border-ink/8 bg-sand shadow-card ${
        pinned ? 'md:w-[24rem] lg:w-[27rem]' : ''
      }`}
    >
      <div className="relative h-56 overflow-hidden">
        <ResponsiveImage
          photo={destination.image}
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          sizes="440px"
        />
        {/* clay gradient rises from the bottom on hover */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(180deg, rgba(193,104,60,0) 0%, rgba(193,104,60,0.75) 100%)',
          }}
        />
        <div className="absolute bottom-4 left-5 right-5">
          <p className="font-display text-2xl font-medium text-sand">{destination.name}</p>
          <p className="text-[13px] uppercase tracking-widest text-sand/85">
            {destination.epithet}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6">
        <p className="text-[15px] leading-relaxed text-sand-muted">{destination.body}</p>

        <p className="flex items-center gap-2 text-[13px] font-medium text-clay-deep">
          <CalendarDays size={14} aria-hidden="true" />
          Best time: {destination.bestTime}
        </p>

        <a
          href="#tours"
          className="link-arrow mt-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
        >
          Explore Tours
          <span className="arrow" aria-hidden="true">
            <ArrowRight size={16} />
          </span>
        </a>
      </div>
    </article>
  );
}
