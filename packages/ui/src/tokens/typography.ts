/**
 * Cardioline Design System — Typography Tokens
 *
 * Font pairing: Inter (body/UI) + DM Sans (headings)
 * Clinical, precise, premium — "Made in Italy" feel
 */

export const typography = {
  fontFamily: {
    sans:    ['Inter', 'system-ui', 'sans-serif'],
    heading: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
    mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    xs:   ['0.75rem',  { lineHeight: '1rem' }],
    sm:   ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem',     { lineHeight: '1.5rem' }],
    lg:   ['1.125rem', { lineHeight: '1.75rem' }],
    xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem',  { lineHeight: '2rem' }],
    '3xl': ['1.875rem',{ lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem',    { lineHeight: '1.1' }],
  },
  fontWeight: {
    normal:   '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
  },
} as const;

export const spacing = {
  /* 4pt/8pt rhythm */
  '0.5':  '2px',
  '1':    '4px',
  '1.5':  '6px',
  '2':    '8px',
  '3':    '12px',
  '4':    '16px',
  '5':    '20px',
  '6':    '24px',
  '8':    '32px',
  '10':   '40px',
  '12':   '48px',
  '16':   '64px',
  '20':   '80px',
  '24':   '96px',
} as const;

export const borderRadius = {
  none:   '0px',
  sm:     '4px',
  DEFAULT:'6px',
  md:     '8px',
  lg:     '12px',
  xl:     '16px',
  '2xl':  '20px',
  '3xl':  '24px',
  full:   '9999px',
} as const;

export const shadows = {
  sm:     '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT:'0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md:     '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg:     '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl:     '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  /* Medical-grade card elevation */
  card:   '0 2px 12px -2px rgba(45, 106, 224, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.06)',
  /* Primary glow — for focus rings and hover */
  glow:   '0 0 0 3px rgba(45, 106, 224, 0.15)',
} as const;
