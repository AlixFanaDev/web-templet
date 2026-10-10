/**
 * React Bits **GradualBlur** (edge variant).
 *
 * Softly blurred edges for marquees so items fade in/out instead of
 * hard-cutting at the container boundary. Backdrop blur + a linear mask —
 * pure compositing, no per-frame JS.
 *
 * `side="left"` fades from transparent → visible, `side="right"` the reverse.
 */
export function GradualBlur({
  side,
  className = '',
  width = 'w-16 md:w-24',
}: {
  side: 'left' | 'right';
  className?: string;
  width?: string;
}) {
  const mask =
    side === 'left'
      ? // opaque at the container edge (full blur) fading to clear mid-container
        'linear-gradient(to right, black 0%, transparent 100%)'
      : 'linear-gradient(to left, black 0%, transparent 100%)';

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 z-10 ${width} ${className}`}
      style={{
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
