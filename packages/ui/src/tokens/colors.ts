/**
 * Beat Design System — Color Tokens
 * by Cardioline
 *
 * Colors extracted directly from cardioline.com CSS:
 *   --awb-color5: #ee5b00  → Primary Brand Orange (buttons, CTAs, links)
 *   --awb-color6: #071046  → Deep Navy (headings, dark surfaces)
 *   --awb-color2: #f1f4fe  → Light Blue Tint (backgrounds)
 *   --awb-color3: #ffe0e0  → Light Coral (accent backgrounds)
 *   --awb-color7: #ab8ed3  → Lavender (secondary accent)
 *
 * Typography (from cardioline.com):
 *   Headings: 'Plus Jakarta Sans'
 *   Body/UI:  'Inter'
 */

export const beatColors = {
  /* === PRIMARY — Cardioline Orange === */
  primary: {
    50:  '#fff5ee',
    100: '#ffe9d5',
    200: '#ffcfaa',
    300: '#ffad72',
    400: '#ff7d38',
    500: '#ee5b00',  /* Brand primary — awb-color5 */
    600: '#d44e00',
    700: '#b03d00',
    800: '#8c3100',
    900: '#712700',
    950: '#3d1200',
  },

  /* === NAVY — Cardioline Deep Blue === */
  navy: {
    50:  '#f1f4fe',  /* awb-color2 */
    100: '#dde4fc',
    200: '#c2ccf9',
    300: '#97abf4',
    400: '#6680ed',
    500: '#3d57e3',
    600: '#2a3dd9',
    700: '#222fb7',
    800: '#1e2894',
    900: '#1b2576',
    950: '#071046',  /* awb-color6 — deepest navy */
  },

  /* === CORAL — Light accent === */
  coral: {
    50:  '#fff5f5',
    100: '#ffe0e0',  /* awb-color3 */
    200: '#ffc5c5',
    300: '#ff9a9a',
    400: '#ff6060',
    500: '#f83030',
    600: '#e51414',
    700: '#c20e0e',
    800: '#a11010',
    900: '#861414',
    950: '#490505',
  },

  /* === LAVENDER — Secondary accent === */
  lavender: {
    400: '#c3aae0',
    500: '#ab8ed3',  /* awb-color7 */
    600: '#9370c8',
    700: '#7b57b3',
  },

  /* === NEUTRAL === */
  neutral: {
    0:   '#ffffff',
    50:  '#f9f9fb',
    100: '#f1f4fe',  /* awb-color2 */
    200: '#e9eaee',
    300: '#d3d3d3',
    400: '#959ea9',
    500: '#747474',  /* muted text */
    600: '#4a4e57',
    700: '#393939',
    800: '#212934',
    900: '#333333',  /* body text */
    950: '#071046',  /* deep navy */
  },

  /* === SEMANTIC === */
  success: { 500: '#65bc7b', 600: '#4da562' },
  warning: { 500: '#fcb900', 600: '#e0a500' },
  error:   { 500: '#e0284f', 600: '#c41e41' },
} as const;

/**
 * Semantic token mapping for CSS custom properties.
 * Compatible with shadcn/ui theming system.
 */
export const semanticColors = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: {
    DEFAULT:    'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
  popover: {
    DEFAULT:    'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))',
  },
  primary: {
    DEFAULT:    'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  secondary: {
    DEFAULT:    'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  muted: {
    DEFAULT:    'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  accent: {
    DEFAULT:    'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  },
  destructive: {
    DEFAULT:    'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
  },
  border: 'hsl(var(--border))',
  input:  'hsl(var(--input))',
  ring:   'hsl(var(--ring))',
  chart: {
    '1': 'hsl(var(--chart-1))',
    '2': 'hsl(var(--chart-2))',
    '3': 'hsl(var(--chart-3))',
    '4': 'hsl(var(--chart-4))',
    '5': 'hsl(var(--chart-5))',
  },
} as const;
