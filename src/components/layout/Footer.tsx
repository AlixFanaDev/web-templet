import { animate, onScroll, stagger } from 'animejs';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { useRef } from 'react';
import { useAnimeScope } from '@/lib/use-anime-scope';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import type { NavLink } from '@/components/twentyone/floating-navbar';

const QUICK_LINKS: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Tours', href: '#tours' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Blog', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#cta' },
];

const POPULAR_TOURS = [
  '3-Day Marrakech to Merzouga Desert Tour',
  '2-Day Fes to Merzouga Desert Tour',
  '8-Day Grand Tour of Morocco',
  'Atlas Mountains Day Trip',
  'Custom Tours',
];

type Social = {
  label: string;
  icon?: typeof Facebook;
  /** Glyph fallback where Lucide ships no brand mark (Pinterest, TripAdvisor). */
  text?: string;
};

// NOTE: Lucide ships Facebook / Instagram / Twitter / YouTube but no Pinterest
// or TripAdvisor mark; those two fall back to letter glyphs rather than
// pulling in a second icon package.
const SOCIALS: Social[] = [
  { label: 'Facebook', icon: Facebook },
  { label: 'Instagram', icon: Instagram },
  { label: 'Twitter / X', icon: Twitter },
  { label: 'Pinterest', text: 'P' },
  { label: 'YouTube', icon: Youtube },
  { label: 'TripAdvisor', text: 'Ⓣ' },
];

const TOUR_LINKS = POPULAR_TOURS.map((label) => ({ label, href: '#tours' }));

/**
 * Site footer — dark `indigo-night` band with grain, four columns, newsletter
 * and the legal bottom bar. Columns fade up 40px with a 90ms stagger when the
 * footer enters the viewport.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useAnimeScope(ref, () => {
    const section = ref.current;
    const columns = section?.querySelectorAll<HTMLElement>('[data-footer-col]');
    if (!section || !columns?.length) return;

    animate(columns, {
      opacity: [0, 1],
      y: [40, 0],
      duration: 800,
      delay: stagger(90),
      ease: 'outExpo',
      // Plays when the footer scrolls into view; auto-reverted with the scope.
      autoplay: onScroll({ target: section, enter: '85% top' }),
    });
  });

  return (
    <footer ref={ref} className="relative overflow-hidden bg-indigo-night text-sand">
      <GrainOverlay />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-10 pt-20 md:px-10 md:pt-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Col 1 — brand */}
          <div data-footer-col className="flex flex-col gap-4">
            <p className="font-display text-xl font-semibold uppercase leading-tight tracking-[0.16em] text-sand">
              Musti Targui
              <span className="block">Morocco Tours</span>
            </p>
            <p className="font-display text-lg italic text-saffron">Your Journey, Our Passion.</p>
            <ul className="mt-2 flex flex-col gap-3 text-sm text-sand/70">
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-1 shrink-0 text-saffron" aria-hidden="true" />
                <a href="mailto:info@mustitarguimoroccotours.com" className="hover:text-sand">
                  info@mustitarguimoroccotours.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-saffron" aria-hidden="true" />
                <a href="tel:+212XXXXXXXXX" className="hover:text-sand">
                  +212 XXX XXX XXX
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="shrink-0 text-saffron" aria-hidden="true" />
                <span>Merzouga, Morocco</span>
              </li>
            </ul>
          </div>

          {/* Col 2 — quick links */}
          <nav data-footer-col aria-label="Quick links" className="flex flex-col gap-4">
            <EyebrowLabel tone="saffron">Quick Links</EyebrowLabel>
            <ul className="flex flex-col gap-1">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-[44px] items-center text-sm text-sand/70 transition-colors duration-200 hover:text-saffron"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3 — popular tours */}
          <nav data-footer-col aria-label="Popular tours" className="flex flex-col gap-4">
            <EyebrowLabel tone="saffron">Popular Tours</EyebrowLabel>
            <ul className="flex flex-col gap-1">
              {TOUR_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-[44px] items-center text-sm text-sand/70 transition-colors duration-200 hover:text-saffron"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 4 — newsletter */}
          <div data-footer-col className="flex flex-col gap-4">
            <EyebrowLabel tone="saffron">Newsletter</EyebrowLabel>
            <h2 className="font-display text-xl font-medium leading-snug text-sand">
              Get Travel Tips &amp; Exclusive Offers
            </h2>
            <p className="text-sm leading-relaxed text-sand/70">
              Join our newsletter for insider tips on travelling in Morocco, special offers, and
              inspiring stories from the Sahara.
            </p>

            <form
              className="mt-1 flex items-center gap-2 rounded-full border border-sand/25 bg-sand/5 p-1.5 focus-within:border-saffron"
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="Email address"
                className="min-h-[44px] w-full min-w-0 bg-transparent px-4 text-sm text-sand placeholder:text-sand/45 focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-[44px] shrink-0 rounded-full bg-clay-deep px-5 text-sm font-medium text-sand transition-colors duration-300 hover:bg-saffron hover:text-indigo-night"
              >
                Subscribe
              </button>
            </form>

            <ul className="mt-3 flex flex-wrap gap-2">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href="#home"
                    aria-label={social.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand/20 text-sand/70 transition-colors duration-300 hover:border-saffron hover:text-saffron"
                  >
                    {social.text ? (
                      <span aria-hidden="true" className="text-base leading-none">
                        {social.text}
                      </span>
                    ) : social.icon ? (
                      <social.icon size={17} aria-hidden="true" />
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-sand/10 pt-7 text-xs text-sand/55 md:flex-row">
          <p>© 2025 Musti Targui Morocco Tours. All Rights Reserved.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <a href="#faq" className="transition-colors hover:text-saffron">
              Privacy Policy
            </a>
            <span aria-hidden="true">·</span>
            <a href="#faq" className="transition-colors hover:text-saffron">
              Terms &amp; Conditions
            </a>
            <span aria-hidden="true">·</span>
            <a href="#home" className="transition-colors hover:text-saffron">
              Sitemap
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
