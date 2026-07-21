/**
 * Cardioline Design System — Color Tokens
 *
 * Inspired by Cardioline's brand identity:
 * - Deep navy/blue for trust and professionalism
 * - Red accent for cardiac/ECG wave references
 * - Clean whites and grays for clinical clarity
 * - "Made in Italy" premium feel
 */

export const cardiolineColors = {
  /* === PRIMARY BRAND === */
  /* Deep Navy Blue — primary brand, headers, CTAs */
  primary: {
    50:  '#eef4ff',
    100: '#d9e8ff',
    200: '#bcd5ff',
    300: '#8db9ff',
    400: '#5891ff',
    500: '#2d6ae0',  /* Main brand blue */
    600: '#1d52c8',
    700: '#1840a2',
    800: '#183682',
    900: '#19306b',  /* Dark navy */
    950: '#111f47',
  },

  /* === ECG RED ACCENT === */
  /* Cardiac red — accent, ECG wave color, alerts */
  cardiac: {
    50:  '#fff1f1',
    100: '#ffe1e1',
    200: '#ffc8c8',
    300: '#ffa0a0',
    400: '#ff6b6b',
    500: '#f83b3b',  /* ECG wave red */
    600: '#e51c1c',
    700: '#c11414',
    800: '#a01414',
    900: '#841818',
    950: '#480808',
  },

  /* === NEUTRAL / CLINICAL === */
  slate: {
    50:  '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  /* === SUCCESS / NORMAL RANGE === */
  success: {
    500: '#16a34a',
    600: '#15803d',
  },

  /* === WARNING === */
  warning: {
    500: '#d97706',
    600: '#b45309',
  },
} as const;

/**
 * Semantic color tokens mapped to CSS custom properties
 * Used in tailwind.config.ts
 */
export const semanticColors = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))',
  },
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
  },
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  chart: {
    '1': 'hsl(var(--chart-1))',
    '2': 'hsl(var(--chart-2))',
    '3': 'hsl(var(--chart-3))',
    '4': 'hsl(var(--chart-4))',
    '5': 'hsl(var(--chart-5))',
  },
} as const;
