import { animate, createSpring, onScroll, stagger } from 'animejs';
import { Car, Headphones, Map, Sun, Wallet, Footprints } from 'lucide-react';
import { useRef } from 'react';
import { CountUp } from '@/components/bits/CountUp';
import { SpotlightCard } from '@/components/bits/SpotlightCard';
import { BentoGrid, BentoGridItem, type BentoSpan } from '@/components/twentyone/bento-grid';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useAnimeScope } from '@/lib/use-anime-scope';
import { useReducedMotion } from '@/lib/use-reduced-motion';

type Reason = {
  icon: typeof Sun;
  title: string;
  body: string;
  span: BentoSpan;
};

const REASONS: Reason[] = [
  {
    icon: Sun,
    span: 'wide',
    title: 'Born in the Desert, Raised in Hospitality',
    body: "Our founder, Musti, was born in the Sahara and grew up learning the ancient ways of the desert and the warm traditions of Berber hospitality. This isn't a job for us — it's our heritage. When you travel with Musti Targui, you experience Morocco through the eyes of those who have lived it for generations.",
  },
  {
    icon: Map,
    span: 'tall',
    title: '100% Private, Tailor-Made Journeys',
    body: 'Every tour we create is designed exclusively for you. No crowded buses. No rigid schedules. No strangers. Just you, your travel companions, your personal driver-guide, and an itinerary built around your interests, your pace, and your budget. Want to stop for a photo of a shepherd herding goats? We stop. Want to spend an extra hour in the souk? We wait. Your journey, your rules.',
  },
  {
    icon: Footprints,
    span: 'default',
    title: 'Authentic Sahara Desert Specialists',
    body: "The desert is our home, and we know it better than anyone. Our deep-rooted connections in Merzouga, M'Hamid, and beyond allow us to offer truly immersive experiences: camel treks at golden hour, sandboarding down towering dunes, traditional Berber music around a crackling campfire, and nights in comfortable, authentic camps far from the tourist crowds.",
  },
  {
    icon: Car,
    span: 'default',
    title: 'Comfort, Safety & Professionalism',
    body: "Travel in comfort in our modern, air-conditioned 4x4 vehicles and luxury vans. Our drivers are licensed professionals with years of experience navigating Morocco's diverse terrain — from winding mountain passes to sandy desert tracks. We prioritise your safety, comfort, and peace of mind from the moment you land until your final farewell.",
  },
  {
    icon: Wallet,
    span: 'default',
    title: 'Transparent Pricing & Best Value',
    body: 'We believe in honest, transparent pricing with absolutely no hidden costs. What you see is what you pay. Your budget goes directly toward unforgettable experiences, quality accommodations, expert guiding, and the local communities we support — not corporate overheads.',
  },
  {
    icon: Headphones,
    span: 'wide-bottom',
    title: '24/7 Support & Effortless Booking',
    body: "Planning a trip can feel overwhelming. That's why our team is available around the clock to answer your questions, refine your itinerary, and support you throughout your journey. Booking your Moroccan adventure with us is fast, easy, and completely stress-free — from first inquiry to final farewell.",
  },
];

type Stat = {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
  srLabel?: string;
};

const STATS: Stat[] = [
  { value: 10, suffix: '+', label: 'Years of Experience' },
  { value: 5000, suffix: '+', label: 'Happy Travellers', srLabel: '5,000+ Happy Travellers' },
  { value: 50, suffix: '+', label: 'Destinations Covered' },
  { value: 5, suffix: '', label: 'Average Rating', decimals: 1, srLabel: '5.0 Average Rating' },
];

/**
 * "Why Choose Us" — the dark centrepiece band.
 *
 * Asymmetric bento grid (hero tile spans two columns, one tall tile), each
 * card wrapped in a spotlight card with a cursor-following glow. Cards reveal
 * with a 110ms stagger; icons spring in 200ms after their card.
 *
 * NOTE: the brief lists emoji as the card icons but also asks for icons in
 * `--saffron`; Lucide glyphs were chosen so the icons actually take the
 * saffron token and stay on-brand with the rest of the icon set.
 */
export function WhyChooseUs() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useAnimeScope(
    ref,
    () => {
      const root = ref.current;
      if (!root) return;

      const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-reason-card]'));
      const icons = Array.from(root.querySelectorAll<HTMLElement>('[data-reason-icon]'));
      const header = root.querySelector<HTMLElement>('[data-reason-header]');
      const stats = root.querySelector<HTMLElement>('[data-reason-stats]');

      if (header) {
        animate(header, {
          opacity: [0, 1],
          y: [30, 0],
          duration: 900,
          ease: 'outExpo',
          autoplay: onScroll({ target: root, enter: '75% top' }),
        });
      }

      if (cards.length) {
        animate(cards, {
          opacity: [0, 1],
          y: [60, 0],
          scale: [0.97, 1],
          duration: 800,
          delay: stagger(110),
          ease: 'outExpo',
          autoplay: onScroll({ target: cards[0], enter: '75% top' }),
        });
      }

      if (icons.length) {
        animate(icons, {
          scale: [0.6, 1],
          opacity: [0, 1],
          duration: 900,
          delay: stagger(110, { start: 200 }),
          ease: createSpring({ stiffness: 90, damping: 18 }),
          autoplay: onScroll({ target: cards[0], enter: '75% top' }),
        });
      }

      if (stats) {
        animate(stats, {
          opacity: [0, 1],
          y: [40, 0],
          duration: 800,
          ease: 'outExpo',
          autoplay: onScroll({ target: stats, enter: '85% top' }),
        });
      }
    },
    !reduced,
  );

  return (
    <section
      ref={ref}
      id="why-us"
      aria-labelledby="why-us-title"
      className="relative overflow-hidden bg-indigo-night py-28 md:py-40"
    >
      <GrainOverlay />

      {/* soft clay glow behind the grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(193,104,60,0.5) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <div data-reason-header>
          <SectionHeading
            id="why-us-title"
            eyebrow="Why Travel With Us"
            title="Six Reasons Travellers Trust Us With Their Moroccan Adventure"
            tone="light"
          />
        </div>

        <BentoGrid className="mt-14">
          {REASONS.map((reason) => {
            const Icon = reason.icon;
            return (
              <BentoGridItem key={reason.title} span={reason.span}>
                <SpotlightCard
                  data-reason-card=""
                  className="h-full rounded-2xl border border-sand/10 bg-sand/[0.04] p-7 backdrop-blur-sm transition-colors duration-300 hover:border-saffron/30 md:p-8"
                >
                  <span
                    data-reason-icon
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-saffron/30 text-saffron will-change-transform"
                  >
                    <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl font-medium leading-snug text-sand md:text-2xl">
                    {reason.title}
                  </h3>
                  <p className="mt-3.5 text-[15px] leading-relaxed text-sand/65">{reason.body}</p>
                </SpotlightCard>
              </BentoGridItem>
            );
          })}
        </BentoGrid>

        {/* CountUp strip */}
        <div
          data-reason-stats
          className="mt-14 grid grid-cols-2 gap-6 border-t border-sand/10 pt-10 md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <span className="font-display text-4xl font-medium text-saffron md:text-5xl">
                <CountUp
                  value={stat.value}
                  suffix={stat.suffix ?? ''}
                  decimals={stat.decimals ?? 0}
                  srLabel={stat.srLabel}
                />
              </span>
              <span className="text-[13px] uppercase tracking-wider text-sand/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
