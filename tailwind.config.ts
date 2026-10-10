import type { Config } from 'tailwindcss';

/**
 * Custom theme tokens for Musti Targui Morocco Tours.
 * Every colour token is mirrored as a CSS variable in `src/styles/globals.css`
 * so components can use either the Tailwind class or the raw CSS variable.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Values mirror the CSS variables in src/styles/globals.css (source of
        // truth for raw CSS) and are exposed as RGB channels so Tailwind can
        // generate opacity variants like `bg-sand/70`.
        sand: {
          DEFAULT: 'rgb(var(--sand-rgb) / <alpha-value>)',
          deep: 'rgb(var(--sand-deep-rgb) / <alpha-value>)',
          muted: 'rgb(var(--sand-muted-rgb) / <alpha-value>)',
        },
        clay: {
          DEFAULT: 'rgb(var(--clay-rgb) / <alpha-value>)',
          deep: 'rgb(var(--clay-deep-rgb) / <alpha-value>)',
        },
        saffron: {
          DEFAULT: 'rgb(var(--saffron-rgb) / <alpha-value>)',
          deep: 'rgb(var(--saffron-deep-rgb) / <alpha-value>)',
        },
        majorelle: 'rgb(var(--majorelle-rgb) / <alpha-value>)',
        'indigo-night': 'rgb(var(--indigo-night-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.18em',
      },
      boxShadow: {
        // Warm-tinted shadows — never pure black.
        card: '0 2px 6px -1px rgba(28, 26, 23, 0.06), 0 12px 32px -8px rgba(193, 104, 60, 0.14)',
        'card-hover':
          '0 4px 10px -2px rgba(28, 26, 23, 0.08), 0 24px 56px -12px rgba(193, 104, 60, 0.22)',
        pill: '0 1px 2px rgba(28, 26, 23, 0.08), 0 8px 20px -8px rgba(193, 104, 60, 0.35)',
      },
      keyframes: {
        // marquee / marquee-reverse live in src/styles/globals.css — the name
        // is applied via inline longhands, which Tailwind can't detect.
        'scroll-cue': {
          '0%': { transform: 'scaleY(0)', 'transform-origin': 'top' },
          '45%': { transform: 'scaleY(1)', 'transform-origin': 'top' },
          '55%': { transform: 'scaleY(1)', 'transform-origin': 'bottom' },
          '100%': { transform: 'scaleY(0)', 'transform-origin': 'bottom' },
        },
        'cta-drift': {
          '0%': { transform: 'translate3d(0,0,0) scale(1.05)' },
          '50%': { transform: 'translate3d(-3%, 2%, 0) scale(1.12)' },
          '100%': { transform: 'translate3d(0,0,0) scale(1.05)' },
        },
        'haze-drift': {
          '0%': { transform: 'translate3d(0, 10px, 0)' },
          '100%': { transform: 'translate3d(0, -14px, 0)' },
        },
      },
      animation: {
        'scroll-cue': 'scroll-cue 2.2s ease-in-out infinite',
        'cta-drift': 'cta-drift 20s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
