/**
 * React Bits **Aurora** (CSS variant) — low-opacity atmosphere behind the
 * Plan CTA band.
 *
 * Three soft radial colour fields drift on a 20s linear loop (compositor-only
 * transform/scale, no JS). Held at 18% opacity so it reads as light rather
 * than decoration — NOTE: chose Aurora over the canvas Threads component
 * because the brief also asks for a slow 20s drift, which a static CSS layer
 * delivers without a per-frame canvas repaint.
 */
export function Aurora({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="animate-cta-drift absolute inset-[-10%] opacity-[0.18]"
        style={{
          background:
            'radial-gradient(38% 44% at 18% 24%, rgba(193,104,60,0.85) 0%, transparent 62%),' +
            'radial-gradient(34% 40% at 82% 28%, rgba(46,75,168,0.75) 0%, transparent 64%),' +
            'radial-gradient(46% 52% at 52% 88%, rgba(224,168,62,0.55) 0%, transparent 66%)',
          filter: 'blur(46px)',
        }}
      />
    </div>
  );
}
