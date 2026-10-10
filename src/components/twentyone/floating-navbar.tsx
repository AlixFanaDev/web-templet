import { Menu, X } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * 21st.dev **Floating Navbar** — base component (restyle happens in
 * `components/layout/Navbar.tsx`, which owns all scroll behaviour + Anime.js
 * transitions). Presentational only: markup, semantics and responsive slots.
 *
 * Install reference used as the source pattern:
 *   npx shadcn@latest add "https://21st.dev/r/default/floating-navbar"
 */
export type NavLink = { label: string; href: string };

type Props = {
  brand: ReactNode;
  links: NavLink[];
  actions?: ReactNode;
  /** true on mobile (<md) where the hamburger replaces the link list */
  menuOpen: boolean;
  onToggleMenu: () => void;
  /** forwarded to the <nav> element — Navbar drives colour + frosted states */
  navRef: React.Ref<HTMLElement>;
  containerClassName?: string;
  wordmarkClassName?: string;
};

export function FloatingNavbar({
  brand,
  links,
  actions,
  menuOpen,
  onToggleMenu,
  navRef,
  containerClassName = '',
  wordmarkClassName = '',
}: Props) {
  return (
    <nav ref={navRef} className={containerClassName} aria-label="Main">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        {/* Brand */}
        <a
          href="#home"
          className={`flex min-h-[44px] items-center gap-2.5 ${wordmarkClassName}`}
          aria-label="Musti Targui Morocco Tours — home"
        >
          {brand}
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-[44px] items-center px-3.5 text-[14px] font-medium tracking-tight transition-opacity duration-200 hover:opacity-70"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex">{actions}</span>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={onToggleMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
