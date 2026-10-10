import { animate, createSpring, createTimeline, stagger } from 'animejs';
import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import { FloatingNavbar, type NavLink } from '@/components/twentyone/floating-navbar';
import { prefersReducedMotion, useReducedMotion } from '@/lib/use-reduced-motion';
import { useScrolledPast, useScrollDirection } from '@/lib/use-scroll';

const LINKS: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Tours', href: '#tours' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
];

/** Small dune + sun mark used beside the wordmark. */
function DuneMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="22.5" cy="9.5" r="4" fill="currentColor" opacity="0.85" />
      <path
        d="M2 22c3.6 0 4.8-4.4 8.4-4.4S16 22 19.6 22s4.4-5.4 8.4-5.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M2 26.5h26"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M6.5 18.5c1.9 0 2.6-3 4.5-3s2.7 3 4.6 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

/**
 * Sticky navbar.
 *
 * - transparent with white text over the hero,
 * - after 80px: frosted-glass bar (Anime.js `animate()` on the nav element —
 *   background-color + backdrop-filter + padding, 350ms outExpo),
 * - hides on scroll down past 400px, reveals on scroll up (400ms spring),
 * - mobile: full-screen overlay with a 60ms staggered link reveal, focus trap
 *   and Escape-to-close.
 */
export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const scrolled = useScrolledPast(80);
  const direction = useScrollDirection(400);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const lenis = useLenis();

  /* ---------------------------------------------------------------- glass */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || reduced) return;

    animate(nav, {
      backgroundColor: scrolled ? 'rgba(244, 237, 228, 0.72)' : 'rgba(244, 237, 228, 0)',
      backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
      paddingTop: scrolled ? 6 : 16,
      paddingBottom: scrolled ? 6 : 16,
      duration: 350,
      ease: 'outExpo',
      composition: 'replace',
    });
  }, [scrolled, reduced]);

  /* ------------------------------------------------- hide / reveal on scroll */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || reduced) return;

    // While the mobile overlay is open the bar must stay pinned in place.
    const hidden = !menuOpen && direction === 'down';
    const spring = createSpring({ stiffness: 90, damping: 18 });
    animate(nav, {
      y: hidden ? '-110%' : '0%',
      duration: 500,
      ease: spring,
      composition: 'replace',
    });
  }, [direction, reduced, menuOpen]);

  /* -------------------------------------------------------- mobile overlay */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !menuOpen) return;

    restoreFocusRef.current = document.activeElement as HTMLElement;
    lenis?.stop();

    const links = overlay.querySelectorAll<HTMLElement>('[data-menu-link]');
    const brand = overlay.querySelector<HTMLElement>('[data-menu-brand]');
    if (prefersReducedMotion() || reduced) {
      animate([overlay, ...(brand ? [brand] : []), ...links], { opacity: 1, y: 0, duration: 0 });
      return;
    }

    const tl = createTimeline({ defaults: { ease: 'outExpo' } }).add(
      overlay,
      { opacity: [0, 1], duration: 300 },
      0,
    );
    if (brand) tl.add(brand, { opacity: [0, 1], y: [16, 0], duration: 500 }, 60);
    tl.add(links, { opacity: [0, 1], y: [24, 0], duration: 500, delay: stagger(60) }, 120);
  }, [menuOpen, reduced, lenis]);

  // When the menu closes: resume scrolling and hand focus back to the trigger.
  useEffect(() => {
    if (menuOpen) return;
    lenis?.start();
    const restore = restoreFocusRef.current;
    if (restore) {
      restore.focus({ preventScroll: true });
      restoreFocusRef.current = null;
    }
  }, [menuOpen, lenis]);

  // Close animation: fade the overlay out, then unmount it.
  const closeMenu = () => {
    const overlay = overlayRef.current;
    if (!overlay || prefersReducedMotion() || reduced) {
      setMenuOpen(false);
      return;
    }
    const links = overlay.querySelectorAll<HTMLElement>('[data-menu-link]');
    animate(links, { opacity: 0, y: 16, duration: 220, delay: stagger(20, { from: 'last' }), ease: 'inOutQuad' });
    animate(overlay, {
      opacity: 0,
      duration: 260,
      ease: 'inOutQuad',
      onComplete: () => setMenuOpen(false),
    });
  };

  // Focus trap + Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;

      const overlay = overlayRef.current;
      if (!overlay) return;

      // The overlay + the (visible) header controls form one focus loop, so the
      // close toggle stays Tab-reachable while the menu is open.
      const visible = (el: HTMLElement) => el.getClientRects().length > 0;
      const header = navRef.current;
      const headerFocusables = header
        ? Array.from(header.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter(visible)
        : [];
      const overlayFocusables = Array.from(
        overlay.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );
      const focusables = [...headerFocusables, ...overlayFocusables];
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const index = active ? focusables.indexOf(active) : -1;

      if (event.shiftKey) {
        if (index <= 0) {
          event.preventDefault();
          last.focus();
        }
      } else if (index === -1 || index === focusables.length - 1) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, reduced]);

  // Move focus into the overlay when it opens.
  useEffect(() => {
    if (!menuOpen) return;
    const overlay = overlayRef.current;
    const first = overlay?.querySelector<HTMLElement>('a[href], button:not([disabled])');
    first?.focus({ preventScroll: true });
  }, [menuOpen]);

  // Frosted glass only while scrolling the hero — while the menu is open the
  // bar stays transparent with white text over the dark overlay.
  const glass = scrolled && !menuOpen;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <FloatingNavbar
          navRef={navRef}
          menuOpen={menuOpen}
          onToggleMenu={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
          containerClassName={`transition-[color] duration-300 ${
            glass ? 'text-ink' : 'text-white'
          }`}
          wordmarkClassName="font-display text-[15px] font-semibold uppercase tracking-[0.2em] md:text-base"
          brand={
            <>
              <span className={glass ? 'text-clay' : 'text-saffron'}>
                <DuneMark />
              </span>
              <span className="leading-none">
                {'Musti Targui '}
                <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.32em] opacity-70">
                  Morocco Tours
                </span>
              </span>
            </>
          }
          links={LINKS}
          actions={
            <a href="#cta" className="btn bg-clay-deep text-sand transition-colors duration-300 hover:bg-saffron hover:text-indigo-night">
              Plan Your Trip
            </a>
          }
        />
      </header>

      {/* --------------------------------------------------- mobile overlay */}
      {menuOpen && (
        <div
          ref={overlayRef}
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col justify-center bg-indigo-night px-7 text-sand"
          style={{ opacity: 0 }}
        >
          <span className="grain-overlay" aria-hidden="true" />
          <div data-menu-brand className="eyebrow text-saffron" style={{ opacity: 0 }}>
            Musti Targui Morocco Tours
          </div>
          <ul className="relative z-10 mt-8 flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href} data-menu-link style={{ opacity: 0 }}>
                <a
                  href={link.href}
                  onClick={() => closeMenu()}
                  className="flex min-h-[52px] items-center font-display text-3xl font-medium tracking-tight text-sand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div data-menu-link className="relative z-10 mt-8" style={{ opacity: 0 }}>
            <a
              href="#cta"
              onClick={() => closeMenu()}
              className="btn bg-clay-deep text-sand hover:bg-saffron hover:text-indigo-night"
            >
              Plan Your Trip
            </a>
          </div>
        </div>
      )}
    </>
  );
}
