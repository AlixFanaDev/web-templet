# Musti Targui Morocco Tours — landing page

A single-page, scroll-driven landing page for a Moroccan tour operator: a cinematic
“descent into the Sahara” narrative with buttery 60fps motion, full accessibility
and responsive behaviour down to 375px.

**Stack (locked):** React 18 + TypeScript + Vite · Tailwind CSS 3 (custom theme) ·
[Lenis](https://lenis.darkroom.engineering/) smooth scrolling ·
[Anime.js v4](https://animejs.com/) (`animate`, `createTimeline`, `createScope`,
`stagger`, `onScroll`, `text`, `utils`, `createSpring`) · Lucide React icons ·
React Bits components (Anime.js variants) · 21st.dev-style components (shadcn CLI
pattern). No GSAP, no Framer Motion.

---

## Quick start

```bash
npm install            # (first run may prompt: npm approve-scripts esbuild)
npm run dev            # http://localhost:5173
npm run build          # typecheck + production build → dist/
npm run preview        # serve dist/ locally (what QA was run against)
npm run typecheck      # tsc -b --noEmit
```

Node 18+ recommended. All photography is local — the page makes zero third-party
image requests at runtime (fonts come from Google Fonts).

---

## Project structure

```
index.html                     # fonts (preconnect), AVIF hero preload, favicon
public/
  favicon.svg
  assets/                      # photo triplets: .jpg + .webp + .avif (×21 slots)
scripts/
  fetch-placeholders.py        # download + crop placeholders from Wikimedia Commons
  build-responsive.py          # generate .webp (ImageMagick) + .avif (ffmpeg) variants
  credits.py                   # → docs/IMAGE_CREDITS.md (author + licence per photo)
src/
  main.tsx                     # React root (StrictMode on)
  app.tsx                      # section composition, top → bottom
  styles/globals.css           # CSS vars, Lenis reset, grain, zellige, reduced-motion
  lib/
    lenis-provider.tsx         # ReactLenis config (anchor offset −72, reduced guard)
    use-anime-scope.ts         # createScope wrapper (setup + revert + deps)
    use-reduced-motion.ts      # prefersReducedMotion, useIsDesktop, useParallaxFactor
    scroll.ts                  # revealOnEnter / scrubOnScroll helpers
    use-scroll.ts              # useScrollDirection, useScrolledPast (nav behaviour)
  data/
    assets.ts                  # image registry: path + intrinsic width/height + alt
    lqip.ts                    # base64 blur for the hero (first paint)
    site.ts                    # contact details + socials (single source of truth)
    tours.ts destinations.ts testimonials.ts faqs.ts
  components/
    layout/Navbar.tsx Footer.tsx SmoothScroll.tsx WhatsAppButton.tsx
    sections/                   # Hero, TrustMarquee, Welcome, WhyChooseUs,
                                # FeaturedTours, Destinations, Testimonials,
                                # GalleryParallax, PlanCta, FaqAccordion
    ui/                         # EyebrowLabel, SectionHeading, ResponsiveImage, …
    bits/                       # React Bits (Anime.js): SplitText, BlurText, Magnet,
                                # Marquee, GradualBlur, SpotlightCard, CountUp, Aurora
    twentyone/                  # 21st.dev pattern: floating-navbar, bento-grid,
                                # accordion, testimonial
tailwind.config.ts              # palette as RGB channels → all alpha variants work
```

---

## Design system

Palette tokens live in `src/styles/globals.css` (hex) and
`tailwind.config.ts` (RGB channel pairs so `bg-sand/70` etc. work):

| Token | Hex | Role |
| --- | --- | --- |
| `sand` | `#F4EDE4` | page background |
| `sand-deep` | `#E8DCCB` | alternating bands |
| `clay` | `#C1683C` | primary accent (borders, rules, graphics) |
| `clay-deep` | `#964A20` | AA-safe clay: solid buttons + small text on sand (5.5:1) **and** sand-deep card backgrounds (4.7:1) |
| `saffron` | `#E0A83E` | accents/icons on dark backgrounds |
| `saffron-deep` | `#7A591C` | AA-safe gold for eyebrows on light backgrounds — sand (5.5:1) **and** sand-deep (4.7:1) |
| `majorelle` | `#2E4BA8` | focus rings |
| `indigo-night` | `#10192E` | dark sections, footer |
| `ink` | `#1C1A17` | body text |
| `sand-muted` | `#6B5F51` | secondary text (4.5:1+ on sand and sand-deep) |

> The brief’s palette ships as specified; `clay-deep` / `saffron-deep` are the only
> derived shades, added because small `#C1683C`/`#E0A83E` text on `#F4EDE4` fails
> WCAG AA (3.4:1 and 1.84:1). Bright `clay`/`saffron` remain for graphics, borders
> and everything on indigo. Lighthouse: **100 accessibility / 100 best practices /
> 100 SEO**.

Type: **Fraunces** (display) + **Inter** (body). Eyebrows `11px / 0.18em` uppercase;
H1 `clamp(2.75rem, 8vw, 7rem)`, H2 `clamp(2rem, 5vw, 4rem)`.

---

## Motion system

* **Lenis** does the scrolling (`ReactLenis` in `main.tsx`), anime observes it.
* Every section creates its animation inside `useAnimeScope(ref, setup, ready, deps)`
  so a breakpoint flip (`sticky`, `pinned`, parallax factor) tears the scope down and
  re-creates it with the right layout.
* Springs: `createSpring({ stiffness: 90, damping: 18 })` (the brief’s spec; Anime 4.2
  prints a deprecation notice suggesting `spring()` — intentionally kept).
* Reveals: `ease: 'outExpo'`, 700–1100ms; micro-interactions 200–350ms;
  stagger 40–80ms (text) / 90–140ms (cards).
* Scrubbed motion (parallax, pinned track, tour deck) uses `onScroll({ sync: true })`
  which seeks 1:1 between `enter` and `leave`.

### ⚠️ Anime v4 threshold syntax (container-first!)

`onScroll` threshold strings are **`<container> <target>`**, i.e. *the viewport edge or
% first, the element edge or % second*:

```ts
onScroll({ target: el, enter: 'top 80%' })   // ❌ wrong: element’s 80% point hits viewport top
onScroll({ target: el, enter: '80% top' })   // ✅ right: element top reaches 80% of the viewport
onScroll({ target: el, enter: 'bottom top' })// element top enters at viewport bottom
onScroll({ target: el, leave: 'top bottom' })// element fully scrolled past
```

Useful defaults in `src/lib/scroll.ts`: `revealOnEnter(el)` and
`scrubOnScroll(el, { enter, leave })`.

### Reduced motion

`prefers-reduced-motion` is honoured three times: CSS (marquee/haze/scroll-cue
animations stop in `globals.css`), hooks (`useReducedMotion()` skips anime scopes —
content is never hidden waiting for an animation), and Lenis (`smoothWheel: false`).

---

## Contact & conversion

All contact details live in **`src/data/site.ts`** — one object plus a couple of
helpers — and every tappable contact point reads from it:

| Surface | What it renders |
| --- | --- |
| `layout/Footer.tsx` | email, phone, WhatsApp, location (map link) + live socials |
| `sections/PlanCta.tsx` | “Chat on WhatsApp” + “Call …” buttons and an email/location row |
| `sections/FaqAccordion.tsx` | “Still have a question?” WhatsApp / call panel |
| `sections/FeaturedTours.tsx` | a “Book …” CTA opens WhatsApp pre-filled with that tour |
| `layout/WhatsAppButton.tsx` | floating WhatsApp button, revealed after the hero |
| `index.html` | `TravelAgency` JSON-LD (phone, email, address, socials) |

```ts
import { site, telHref, mailtoHref, whatsapp, whatsappTour } from '@/data/site';

whatsapp();                                  // bare chat link
whatsapp('Hi, I have a question…');          // pre-filled message
whatsappTour('8-Day Grand Tour of Morocco'); // pre-filled per-tour enquiry
```

There is no booking backend: WhatsApp click-to-chat and `mailto:` are the
intentional submission channels, and the footer newsletter hands the signup to
the business inbox. To change a number, email, address or social link, edit
`site.ts` only; remember the JSON-LD copy in `index.html` is the one duplication
(browsers can’t read TypeScript).

---

## Adding content

### How to add a new tour

1. Drop a photo in `public/assets/` (any slot size works — crop roughly 1280×860),
   regenerate variants:
   ```bash
   python3 scripts/build-responsive.py     # makes .webp + .avif next to the .jpg
   ```
2. Register it in `src/data/assets.ts` inside `tourPhotos` (path + width + height + alt):
   ```ts
   atlasDay: photo('tour-atlas', 1280, 860, 'Ourika Valley in the Atlas Mountains'),
   ```
3. Append an entry to `tours` in `src/data/tours.ts`:
   ```ts
   {
     id: '4-day-merzouga-riad-tour',
     badge: 'THE SLOW DESERT ESCAPE',
     title: '4-Day Sahara Tour: Marrakech to Merzouga',
     duration: '4 Days / 3 Nights',
     departure: 'Marrakech (daily)',
     price: 'From: €260 per person',
     highlights: ['Ait Ben Haddou', 'Merzouga', 'Camel Trek'],
     body: '…your copy…',
     image: tourPhotos.myNewTour,
     ctas: ['View Full Itinerary'],   // second entry optional (only tour 1 has two)
   }
   ```
That’s it — the card, reveal animation and mobile stack all pick it up automatically.

Destinations / FAQs / testimonials work the same way through
`src/data/destinations.ts`, `faqs.ts`, `testimonials.ts`.

---

## Components

Third-party UI is vendored (copied in) so builds stay reproducible:

* **React Bits** (Anime.js variants) → `src/components/bits/`. To pull updates or add
  another one:
  ```bash
  npx react-bits@latest add <component-slug>    # e.g. add tilt-cards
  ```
  https://reactbits.dev — choose the **Anime.js** variant (never GSAP/Framer).
* **21st.dev** (shadcn registry pattern) → `src/components/twentyone/`:
  ```bash
  npx shadcn@latest add "https://21st.dev/r/<username>/<component-slug>"
  ```
  Components already vendored: floating-navbar, bento-grid, accordion, testimonial.

Both were adapted to the design tokens (palette classes, Fraunces headings) after
installing.

---

## Placeholder assets

Photography in `public/assets/` is **placeholder** imagery from Wikimedia Commons,
downloaded and centre-cropped by the pipeline:

```bash
python3 scripts/fetch-placeholders.py   # fetch Commons originals → crops (rate-limited)
python3 scripts/build-responsive.py     # → .webp (ImageMagick) + .avif (ffmpeg libsvtav1)
python3 scripts/credits.py              # → docs/IMAGE_CREDITS.md (attribution)
```

Attribution for every image (author + licence) is in **`docs/IMAGE_CREDITS.md`**
(CC BY / CC BY-SA / CC0 — keep that file if you ship the placeholders).

### Replacing with final photography (suggested Unsplash search terms)

Replace the file with the **same name** (or update `src/data/assets.ts`), keep the
intrinsic `width`/`height` accurate, then re-run `build-responsive.py`.

| Slot | File | Search on Unsplash |
| --- | --- | --- |
| Hero | `hero-dunes` | `erg chebbi dunes sunset`, `sahara desert golden hour dunes` |
| Welcome ×3 | `welcome-1..3` | `jemaa el-fnaa marrakech`, `chefchaouen blue alley`, `majorelle garden` |
| Tour cards | `tour-3day` | `camel trek sahara dunes shadows` |
| | `tour-2day` | `barbary macaque azrou cedar forest` |
| | `tour-8day` | `ait ben haddou camels caravan` |
| | `tour-atlas` | `ourika valley atlas mountains morocco` |
| Destinations | `dest-marrakech` | `marrakech souk fruit stall` |
| | `dest-fes` | `fes tannery chouara` |
| | `dest-chefchaouen` | `chefchaouen blue city` |
| | `dest-casablanca` | `hassan ii mosque casablanca` |
| | `dest-ouarzazate` | `ait ben haddou kasbah` |
| | `dest-merzouga` | `merzouga desert camp` |
| Gallery ×7 | `gallery-1..7` | `aerial moroccan dunes`, `sahara camel caravan`, `fes carpets alley`, `chefchaouen street`, `high atlas mountains`, `berber desert camp`, `marrakech medina souk` |

---

## Accessibility

* Semantic sections with `aria-labelledby` per heading; accordion uses
  `aria-expanded` + regions; the mobile menu is a focus-trapping overlay with
  Escape-to-close and focus restore (toggle stays Tab-reachable).
* Majorelle focus rings, ≥44px touch targets, visible skip-less nav order.
* Every image has explicit `width`/`height` (zero CLS) + meaningful alt; the hero
  paints from a base64 LQIP while the AVIF loads (`fetchpriority="high"` preload).
* Horizontal carousels carry `data-lenis-prevent` so Lenis never hijacks touch.
* Reduced-motion users get the full page, statically.

## Performance

* transform/opacity-only animation (accordion height is the one measured exception);
  `will-change` on scrub targets; compositor-friendly CSS marquee.
* `<picture>` AVIF → WebP → JPEG per slot; single local origin, no runtime CDNs.
* Lighthouse target ≥90 on all categories — `npm run build` output is ~66 kB gzip JS.

## Notes / decisions (`// NOTE:` markers in code)

* Emoji in the trust marquee are rendered as specified by the brief; “Why choose us”
  icons use Lucide glyphs in saffron instead of emoji (calmer, on-brand).
* The Destinations “dark → light” transition is an indigo dusk veil over sand-deep,
  because the preceding section is already light.
* BlurText reveals once per viewport entry (IntersectionObserver) rather than
  scrubbing — scrubbing body copy reads as noise.
