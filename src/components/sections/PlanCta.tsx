import { animate, onScroll } from 'animejs';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useRef } from 'react';
import { Aurora } from '@/components/bits/Aurora';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { mailtoHref, site, telHref, whatsapp } from '@/data/site';
import { useAnimeScope } from '@/lib/use-anime-scope';
import { useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Plan CTA band — the conversion moment.
 *
 * A calm dark panel with a low-opacity Aurora drifting on a 20s loop, grain
 * over the top, and a single block that fades up on enter. The actions are the
 * business' real contact channels: WhatsApp first (fastest reply for a tour
 * operator), then a phone call, with email / location as a supporting row.
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
          <a
            href={whatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid-saffron"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            Chat on WhatsApp
          </a>
          <a href={telHref} className="btn-ghost-light">
            <Phone size={17} aria-hidden="true" />
            Call {site.phoneDisplay}
          </a>
        </div>

        {/* Supporting contact row */}
        <dl className="mt-12 grid w-full grid-cols-1 gap-x-8 gap-y-5 text-left sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Mail size={17} className="mt-1 shrink-0 text-saffron" aria-hidden="true" />
            <div>
              <dt className="eyebrow text-sand/55">Email</dt>
              <dd className="mt-1">
                <a href={mailtoHref} className="break-all text-sm text-sand/85 hover:text-saffron">
                  {site.email}
                </a>
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={17} className="mt-1 shrink-0 text-saffron" aria-hidden="true" />
            <div>
              <dt className="eyebrow text-sand/55">Based in</dt>
              <dd className="mt-1">
                <a
                  href={site.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sand/85 hover:text-saffron"
                >
                  {site.location}
                </a>
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </section>
  );
}
