import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../apps/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        /* Extracted from cardioline.com: Plus Jakarta Sans + Inter */
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
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
        /* Beat Design System brand palette */
        beat: {
          orange:      '#ee5b00',  /* Primary — awb-color5 */
          'orange-light': '#ff7d38',
          'orange-pale':  '#fff5ee',
          navy:        '#071046',  /* Deep — awb-color6 */
          'navy-light':   '#1b2576',
          'navy-pale':    '#f1f4fe',  /* awb-color2 */
          coral:       '#ffe0e0',  /* awb-color3 */
          lavender:    '#ab8ed3',  /* awb-color7 */
          success:     '#65bc7b',
          warning:     '#fcb900',
          error:       '#e0284f',
        },
      },
      /* ─── Divider hairlines ──────────────────────────────────────
         The clinical screens draw separators with the literal Tailwind
         grays (`divide-gray-100`, `border-gray-200`, ...).  These shades
         are the stock values lightened by 20% toward white, so every
         hairline in the product softens from one place instead of being
         retuned file by file.  Only border/divide utilities are remapped —
         `bg-gray-*` and `text-gray-*` keep the stock scale. */
      borderColor: {
        gray:  { 100: '#f5f6f8', 200: '#eaecef', 300: '#dadde2' },
        slate: { 100: '#f4f7fa', 200: '#e8edf3' },
      },
      divideColor: {
        gray:  { 100: '#f5f6f8', 200: '#eaecef', 300: '#dadde2' },
        slate: { 100: '#f4f7fa', 200: '#e8edf3' },
      },
      borderRadius: {
        lg:  'var(--radius)',
        md:  'calc(var(--radius) - 2px)',
        sm:  'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card: '0 2px 12px -2px rgba(238, 91, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.06)',
        glow: '0 0 0 3px rgba(238, 91, 0, 0.20)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'beat-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '14%':      { transform: 'scale(1.08)' },
          '28%':      { transform: 'scale(1)' },
          '42%':      { transform: 'scale(1.04)' },
          '70%':      { transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':        'fade-in 0.3s ease-out',
        'beat-pulse':     'beat-pulse 1.5s ease-in-out infinite',
        shimmer:          'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
