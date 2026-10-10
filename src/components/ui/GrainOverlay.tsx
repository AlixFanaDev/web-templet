/**
 * Full-bleed film-grain layer (SVG feTurbulence at ~4.5% opacity).
 * Absolutely positioned inside any dark section — decorative only, so it is
 * hidden from assistive tech and never intercepts pointer events.
 */
export function GrainOverlay() {
  return <span className="grain-overlay" aria-hidden="true" />;
}
