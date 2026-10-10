import { GradualBlur } from '@/components/bits/GradualBlur';
import { Marquee } from '@/components/bits/Marquee';
import { GrainOverlay } from '@/components/ui/GrainOverlay';

const ITEMS = [
  '⭐ 5.0 Rated on TripAdvisor',
  '10+ Years of Experience',
  '5,000+ Happy Travellers',
  '100% Locally Owned',
  'Private & Tailor-Made',
  '24/7 Support',
];

function Diamond() {
  return (
    <span className="px-6 text-saffron" aria-hidden="true">
      ◆
    </span>
  );
}

/**
 * Thin trust band directly beneath the hero — one slow, infinitely looping
 * row (40s) that pauses on hover, with blurred edges so items dissolve
 * instead of hard-cutting.
 */
export function TrustMarquee() {
  const row: React.ReactNode[] = [];
  ITEMS.forEach((item, index) => {
    row.push(
      <span key={item} className="text-[12px] uppercase tracking-widest text-sand/90">
        {item}
      </span>,
    );
    if (index < ITEMS.length - 1) row.push(<Diamond key={`d-${index}`} />);
  });

  return (
    <section
      aria-label="Traveller trust signals"
      className="relative overflow-hidden border-y border-sand/10 bg-indigo-night py-4"
    >
      <GrainOverlay />
      <div className="relative z-10">
        <Marquee items={row} duration={40} label="Why travellers trust Musti Targui" />
        <GradualBlur side="left" />
        <GradualBlur side="right" />
      </div>
    </section>
  );
}
