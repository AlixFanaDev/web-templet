/**
 * Restrained Berber / zellige line motif used between sections.
 * A 1px stroke in `--saffron` at 25% opacity — an SVG of interlocking
 * diamonds (the classic Moroccan khatam star outline).
 */
export function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center px-6 ${className}`} aria-hidden="true">
      <svg
        className="zellige-divider"
        width="260"
        height="26"
        viewBox="0 0 260 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        role="presentation"
      >
        <path d="M0 13 H78" />
        <path d="M182 13 H260" />
        {/* interlocking diamonds */}
        <path d="M104 13 L117 2 L130 13 L117 24 Z" />
        <path d="M130 13 L143 2 L156 13 L143 24 Z" />
        <path d="M117 13 L130 6 L143 13 L130 20 Z" />
        <path d="M91 13 L97.5 6.5 L104 13 L97.5 19.5 Z" />
        <path d="M156 13 L162.5 6.5 L169 13 L162.5 19.5 Z" />
        <circle cx="130" cy="13" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}
