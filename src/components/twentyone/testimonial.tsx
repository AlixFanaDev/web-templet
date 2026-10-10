import { Star } from 'lucide-react';

/**
 * 21st.dev **Testimonial** base card, restyled for the Musti Targui design
 * system: Fraunces italic quote, Inter name/country, five saffron stars.
 *
 * Install reference:
 *   npx shadcn@latest add "https://21st.dev/r/electro0dev/testimonial-card"
 */
type Props = {
  title?: string;
  quote?: string;
  name: string;
  country: string;
  /** `full` = long quote card (row 1), `short` = pull-quote (row 2) */
  variant?: 'full' | 'short';
  className?: string;
};

export function TestimonialCard({
  title,
  quote,
  name,
  country,
  variant = 'full',
  className = '',
}: Props) {
  const stars = Array.from({ length: 5 });

  if (variant === 'short') {
    return (
      <figure
        className={`flex max-w-md flex-col gap-3 rounded-2xl border border-ink/8 bg-sand/70 px-7 py-6 shadow-card ${className}`}
      >
        <div className="flex gap-0.5 text-saffron" aria-hidden="true">
          {stars.map((_, i) => (
            <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        <blockquote className="font-display text-lg italic leading-snug text-ink">
          {title}
        </blockquote>
        <figcaption className="text-[13px] font-medium text-sand-muted">
          {name}, {country}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      className={`flex w-[min(88vw,30rem)] shrink-0 flex-col gap-5 rounded-2xl border border-ink/8 bg-sand/70 px-8 py-8 shadow-card ${className}`}
    >
      <div className="flex gap-0.5 text-saffron" aria-hidden="true">
        {stars.map((_, i) => (
          <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      {title && (
        <blockquote className="font-display text-xl font-medium leading-snug text-ink">
          {title}
        </blockquote>
      )}
      {quote && <p className="text-[15px] leading-relaxed text-sand-muted">{quote}</p>}
      <figcaption className="mt-auto text-[13px] font-medium text-sand-muted">
        {name}, <span className="text-ink/70">{country}</span>
      </figcaption>
    </figure>
  );
}
