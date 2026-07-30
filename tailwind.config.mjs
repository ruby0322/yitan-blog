/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--brand-body)',
            '--tw-prose-headings': 'var(--brand-heading)',
            '--tw-prose-links': 'var(--brand-cta)',
            '--tw-prose-bold': 'var(--brand-subtitle)',
            fontFamily: 'var(--font-sans)',
            lineHeight: '1.9',
            letterSpacing: '0.03em',
            h1: {
              fontFamily: 'var(--font-serif)',
              fontWeight: '700',
              letterSpacing: '0.06em',
              marginBottom: '0.5em',
            },
            h2: {
              fontFamily: 'var(--font-serif)',
              fontWeight: '600',
              letterSpacing: '0.05em',
            },
            h3: {
              fontFamily: 'var(--font-serif)',
              fontWeight: '600',
              letterSpacing: '0.05em',
            },
            h4: {
              fontFamily: 'var(--font-serif)',
              fontWeight: '600',
              letterSpacing: '0.04em',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': 'var(--brand-inverse-fg)',
            '--tw-prose-headings': 'var(--brand-inverse-fg)',
          },
        },
      },
    },
  },
}

export default config
