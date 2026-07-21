# Cardioline Design Monorepo

Official Cardioline monorepo for the **Beat Design System** and all Cardioline digital products.

## Structure

```
cardioline-design/
├── packages/
│   └── ui/                     # Beat Design System (@cardioline/ui)
├── apps/
│   └── vireo-arc/              # ECG / Electrocardiogram App
├── docs/                       # GitHub Pages — Design System Documentation
└── turbo.json
```

## Packages

### `@cardioline/ui` — Beat Design System
Official Cardioline design system built on top of shadcn/ui.
Colors and typography extracted directly from [cardioline.com](https://www.cardioline.com):
- **Primary**: Orange `#ee5b00`
- **Accent / Dark**: Navy `#071046`
- **Fonts**: Plus Jakarta Sans (headings) + Inter (body)

→ [Package README](./packages/ui/README.md)

## Apps

### Vireo Arc
ECG / Electrocardiogram application by Cardioline. Modern interface for cardiac exam reading, interpretation and management.

→ [App README](./apps/vireo-arc/README.md)

## Documentation

Live Beat Design System documentation:

→ **[beat.cardioline.design](https://gabrielvaz.github.io/cardioline-design/)** (GitHub Pages)

## Development

```bash
# Install dependencies
npm install

# Run all apps in dev mode
npm run dev

# Run a specific app
cd apps/vireo-arc && npm run dev

# Full build
npm run build
```

## Stack

- **Monorepo**: Turborepo + npm workspaces
- **Framework**: Next.js 15 (App Router)
- **Design System**: shadcn/ui customized for Cardioline
- **Styling**: Tailwind CSS v3
- **Language**: TypeScript
- **Icons**: Lucide React

## Contributing

All code, comments, documentation and UI strings must be written in **English only**.
