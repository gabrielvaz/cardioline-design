# Beat Design System

**Beat Design System** by Cardioline — shadcn/ui components customized with the official Cardioline brand identity.

## Brand Colors (from cardioline.com CSS)

| Token | Hex | CSS Variable | Usage |
|-------|-----|-------------|-------|
| Primary Orange | `#ee5b00` | `--primary` | Buttons, CTAs, links, active states |
| Deep Navy | `#071046` | `--accent` | Headings, dark surfaces, sidebar |
| Light Blue Tint | `#f1f4fe` | `--secondary` | Light backgrounds, chips |
| Light Coral | `#ffe0e0` | — | Subtle accent backgrounds |
| Lavender | `#ab8ed3` | `--chart-5` | Secondary accent, tags |
| Body Text | `#333333` | `--foreground` | Default text |
| Muted Text | `#747474` | `--muted-foreground` | Placeholders, captions |

## Typography (from cardioline.com)

| Role | Font | Weight |
|------|------|--------|
| Headings | Plus Jakarta Sans | 700 / 800 |
| Body / UI | Inter | 400 / 500 |
| Code / Data | JetBrains Mono | 400 / 500 |

## Components

```tsx
import { Button, Input, Label, Card } from '@cardioline/ui';
import { cn } from '@cardioline/ui';
import { beatColors } from '@cardioline/ui';
```

## Special Variants

```tsx
// Primary brand button — Cardioline Orange
<Button variant="beat">Get Started</Button>

// Destructive / alert
<Button variant="destructive">Delete</Button>
```

## Usage in an App

1. Import global CSS in your app root:
```tsx
import '@cardioline/ui/src/styles/globals.css';
```

2. Extend Tailwind config with Beat DS preset:
```ts
// tailwind.config.ts
import uiConfig from '@cardioline/ui/tailwind.config';
```

## Design System Documentation

→ **[Beat Design System Docs](https://gabrielvaz.github.io/vireo-ark-dolomiti/beat/)** (GitHub Pages)
