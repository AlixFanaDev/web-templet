import { createSpring, createTimeline, onScroll, stagger } from 'animejs';
import { useRef } from 'react';
import { Magnet } from '@/components/bits/Magnet';
import { SplitText } from '@/components/bits/SplitText';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { heroDunes } from '@/data/assets';
import { heroLqip } from '@/data/lqip';
import { useAnimeScope } from '@/lib/use-anime-scope';
import { useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Hero — the opening frame of the journey.
 *
 * Three parallax layers (sky/backdrop photo → mid dune silhouettes →
 * foreground ridge + heat haze), a mount timeline that stages the copy in,
 * and a scroll-scrubbed outro (`onScroll({ sync: true })`) that pulls the
 * layers apart as the page descends into the desert.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useAnimeScope(
    ref,
    (scope) => {
      const root = ref.current;
      if (!root) return;
      const q = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

      /* ------------------------------------------------ 1. mount timeline */
      const bg = root.querySelector<HTMLElement>('[data-hero-bg]');
      const eyebrow = root.querySelector<HTMLElement>('[data-hero-eyebrow]');
      const words = q('[data-split-word]');
      const sub = root.querySelector<HTMLElement>('[data-hero-sub]');
      const buttons = q('[data-hero-btn]');
      const cue = root.querySelector<HTMLElement>('[data-hero-cue]');

      const mount = createTimeline({ defaults: { ease: 'outExpo' } });

      if (bg) mount.add(bg, { opacity: [0, 1], scale: [1.12, 1], duration: 1400 }, 0);
      if (eyebrow) mount.add(eyebrow, { opacity: [0, 1], y: [12, 0], duration: 600 }, 250);
      if (words.length) mount.add(words, { y: ['90%', '0%'], duration: 900, delay: stagger(55) }, 400);
      if (sub) mount.add(sub, { opacity: [0, 1], y: [26, 0], duration: 700 }, '-=400');
      if (buttons.length)
        mount.add(
          buttons,
          {
            opacity: [0, 1],
            scale: [0.94, 1],
            duration: 950,
            delay: stagger(90),
            ease: createSpring({ stiffness: 90, damping: 18 }),
          },
          '-=350',
        );
      if (cue) mount.add(cue, { opacity: [0, 1], duration: 600 }, '-=250');

      /* ------------------------------------------ 2. scroll-scrubbed outro */
      const content = root.querySelector<HTMLElement>('[data-hero-content]');
      const layer1 = root.querySelector<HTMLElement>('[data-hero-layer-1]');
      const layer2 = root.querySelector<HTMLElement>('[data-hero-layer-2]');
      const layer3 = root.querySelector<HTMLElement>('[data-hero-layer-3]');

      // Explicit [from, to] pairs so the scrub never samples a value the mount
      // timeline is still animating.
      const outro = createTimeline({
        defaults: { ease: 'linear' },
        autoplay: onScroll({
          target: root,
          enter: 'top top',
          leave: 'top bottom',
          sync: true,
        }),
      });

      if (content) outro.add(content, { opacity: [1, 0], y: [0, -160], duration: 100 }, 0);
      if (layer1) outro.add(layer1, { y: [0, 48], duration: 100 }, 0); // slowest — lags
      if (layer2) outro.add(layer2, { y: [0, -56], duration: 100 }, 0);
      if (layer3) outro.add(layer3, { y: [0, -124], duration: 100 }, 0); // fastest

      // Exposed on the scope for debugging (scope.revert() tears both down).
      scope.data.mount = mount;
      scope.data.outro = outro;
    },
    !reduced,
  );

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-indigo-night"
    >
      {/* Layer 1 — backdrop: photo + sky gradient (slowest) */}
      <div data-hero-layer-1 className="absolute inset-0 -z-30 will-change-transform">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundColor: '#10192E', backgroundImage: `url("${heroLqip}")` }}
          aria-hidden="true"
        />
        <ResponsiveImage
          photo={heroDunes}
          loading="eager"
          pictureClassName="absolute inset-0"
          className="h-full w-full object-cover"
          imgProps={{
            'data-hero-bg': '',
            fetchPriority: 'high',
            // The LQIP already covers the first paint; this layer starts hidden
            // only when a timeline will reveal it.
            style: reduced ? undefined : { opacity: 0 },
          }}
        />
        {/* indigo-night 65% → transparent at the bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(16,25,46,0.65) 0%, rgba(16,25,46,0.45) 46%, rgba(16,25,46,0.12) 78%, rgba(16,25,46,0) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Layer 2 — mid dune silhouettes (bottom-0 so the hard viewBox edge can
          never peek out between this layer and the foreground ridge) */}
      <div
        data-hero-layer-2
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-[46%] will-change-transform"
        aria-hidden="true"
      >
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="h-full w-full">
          {/* Warm sunset-lit ridge — gentle ≤9% slopes so the non-uniform
              stretch stays smooth at every viewport width */}
          <path
            d="M0 400V262c170-16 380-32 560-26s460 44 560 40s150-32 320-26V400H0Z"
            fill="rgba(193,104,60,0.6)"
          />
          <path
            d="M0 400V296c180-14 400-32 620-26s470 44 560 40s150-28 260-22V400H0Z"
            fill="rgba(28,26,23,0.55)"
          />
        </svg>
      </div>

      {/* Layer 3 — foreground ridge + heat haze (fastest) */}
      <div
        data-hero-layer-3
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[34%] will-change-transform"
        aria-hidden="true"
      >
        <div
          className="absolute inset-x-0 bottom-[72%] h-32 opacity-60"
          style={{
            background:
              'linear-gradient(180deg, rgba(244,237,228,0) 0%, rgba(224,168,62,0.18) 60%, rgba(244,237,228,0.1) 100%)',
            filter: 'blur(18px)',
            animation: 'haze-drift 9s ease-in-out infinite alternate',
          }}
        />
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M0 300V210c160-10 360-24 560-18s460 42 560 38s150-28 320-22V300H0Z"
            fill="rgba(28,26,23,0.88)"
          />
          <path
            d="M0 300V240c150-12 340-28 520-23s470 40 560 35s170-26 360-20V300H0Z"
            fill="rgba(16,25,46,0.96)"
          />
        </svg>
      </div>

      <GrainOverlay />

      {/* Content ---------------------------------------------------------- */}
      <div
        data-hero-content
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-24 text-center will-change-transform"
      >
        <p
          data-hero-eyebrow
          className="eyebrow text-saffron"
          style={reduced ? undefined : { opacity: 0 }}
        >
          Private, Tailor-Made Morocco Tours
        </p>

        <SplitText
          as="h1"
          text="Discover the Soul of the Sahara with Musti Targui"
          className="h1-display mt-7 text-sand"
          wordClassName="[transform-origin:bottom]"
        />

        <p
          data-hero-sub
          className="body-copy mt-8 max-w-3xl text-sand/85"
          style={reduced ? undefined : { opacity: 0 }}
        >
          Private, tailor-made Morocco tours led by local Berber experts. From the bustling medinas
          of Marrakech to the golden dunes of Erg Chebbi, experience Morocco through the eyes of
          those who call it home.
        </p>

        <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <Magnet>
            <a
              data-hero-btn
              href="#tours"
              className="btn-solid-clay shadow-pill"
              style={reduced ? undefined : { opacity: 0 }}
            >
              Explore Our Tours
            </a>
          </Magnet>
          <Magnet>
            <a
              data-hero-btn
              href="#cta"
              className="btn-ghost-light"
              style={reduced ? undefined : { opacity: 0 }}
            >
              Plan Your Custom Journey
            </a>
          </Magnet>
        </div>
      </div>

      {/* Scroll cue -------------------------------------------------------- */}
      <div
        data-hero-cue
        className="absolute bottom-8 left-6 z-10 flex items-center gap-3 md:left-10"
        style={reduced ? undefined : { opacity: 0 }}
        aria-hidden="true"
      >
        <span className="eyebrow text-sand/70">Scroll</span>
        <span className="relative block h-14 w-px overflow-hidden bg-sand/25">
          <span className="absolute inset-x-0 top-0 h-full origin-top animate-scroll-cue bg-saffron" />
        </span>
      </div>
    </section>
  );
}
