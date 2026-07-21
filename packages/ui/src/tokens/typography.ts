/**
 * Beat Design System — Typography, Spacing, Radius, Shadow Tokens
 * by Cardioline
 *
 * Typography from cardioline.com:
 *   - Headings: 'Plus Jakarta Sans' (Google Fonts)
 *   - Body/UI:  'Inter' (Google Fonts)
 *   - Monospace: 'JetBrains Mono'
 */

export const typography = {
  fontFamily: {
    sans:    ['Inter', 'system-ui', 'sans-serif'],
    heading: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
    mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    xs:    ['0.75rem',   { lineHeight: '1rem' }],
    sm:    ['0.875rem',  { lineHeight: '1.25rem' }],
    base:  ['1rem',      { lineHeight: '1.5rem' }],
    lg:    ['1.125rem',  { lineHeight: '1.75rem' }],
    xl:    ['1.25rem',   { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem',    { lineHeight: '2rem' }],
    '3xl': ['1.875rem',  { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem',   { lineHeight: '2.5rem' }],
    '5xl': ['3rem',      { lineHeight: '1.1' }],
    '6xl': ['3.75rem',   { lineHeight: '1' }],
  },
  fontWeight: {
    light:    '300',
    normal:   '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
    extrabold:'800',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight:   '-0.025em',
    normal:  '0em',
    wide:    '0.025em',
    wider:   '0.05em',
    widest:  '0.1em',
  },
  lineHeight: {
    none:    '1',
    tight:   '1.25',
    snug:    '1.375',
    normal:  '1.5',
    relaxed: '1.625',
    loose:   '2',
  },
} as const;

/** 4pt / 8pt base spacing system */
export const spacing = {
  px:   '1px',
  0:    '0px',
  0.5:  '2px',
  1:    '4px',
  1.5:  '6px',
  2:    '8px',
  2.5:  '10px',
  3:    '12px',
  3.5:  '14px',
  4:    '16px',
  5:    '20px',
  6:    '24px',
  7:    '28px',
  8:    '32px',
  9:    '36px',
  10:   '40px',
  11:   '44px',
  12:   '48px',
  14:   '56px',
  16:   '64px',
  20:   '80px',
  24:   '96px',
  28:   '112px',
  32:   '128px',
} as const;

export const borderRadius = {
  none:    '0px',
  sm:      '4px',
  DEFAULT: '6px',
  md:      '8px',
  lg:      '12px',
  xl:      '16px',
  '2xl':   '20px',
  '3xl':   '24px',
  full:    '9999px',
} as const;

export const shadows = {
  sm:      '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md:      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg:      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl:      '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  /* Beat DS card shadow — subtle orange tint */
  card:    '0 2px 12px -2px rgba(238, 91, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.06)',
  /* Focus ring glow */
  glow:    '0 0 0 3px rgba(238, 91, 0, 0.20)',
} as const;
