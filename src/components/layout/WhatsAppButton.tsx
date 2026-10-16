import { animate } from 'animejs';
import { useEffect, useRef, useState } from 'react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { site, whatsapp } from '@/data/site';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { useScrolledPast } from '@/lib/use-scroll';

/**
 * Persistent WhatsApp affordance.
 *
 * Appears once the visitor has scrolled past the hero (so it never competes
 * with the hero CTAs), then stays pinned bottom-right. Deliberately on-brand:
 * an `indigo-night` disc reads on both the sand and indigo bands, while the
 * glyph itself carries the WhatsApp green. Entrance is a small spring scale.
 *
 * Sits at `z-30`, below the navbar (`z-50`) and the mobile menu overlay
 * (`z-40`), so it never covers either.
 */
export function WhatsAppButton() {
  const visible = useScrolledPast(600);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [mounted, setMounted] = useState(false);

  // Keep the node in the tree once first shown so the exit animation can play
  // without a layout jump; `mounted` gates the enter/exit state.
  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !mounted) return;

    if (reduced) {
      animate(el, { opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8, duration: 0 });
      return;
    }
    animate(el, {
      opacity: visible ? [0, 1] : 0,
      scale: visible ? [0.7, 1] : 0.8,
      duration: 450,
      ease: 'outBack',
      composition: 'replace',
    });
  }, [visible, reduced, mounted]);

  if (!mounted) return null;

  return (
    <a
      ref={ref}
      href={whatsapp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${site.name} on WhatsApp`}
      className="group fixed bottom-5 right-5 z-30 inline-flex items-center gap-3 rounded-full bg-indigo-night py-3 pl-3 pr-4 text-sand shadow-card transition-colors duration-300 hover:bg-clay-deep focus-visible:bg-clay-deep md:bottom-7 md:right-7"
      style={reduced ? undefined : { opacity: 0 }}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/10">
        <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
      </span>
      <span className="hidden text-sm font-medium sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
