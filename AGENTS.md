# Cardioline Design — Agent Guide

This repository is the Cardioline frontend monorepo. It contains the **Beat Design System** and **Vireo Arc**, a front-end-only ECG workflow prototype. Treat every screen, route and interaction as mock UI unless a task explicitly asks for backend integration.

## Repository map

| Area | Purpose |
| --- | --- |
| `apps/vireo-arc` | Next.js 15 application for the Vireo Arc ECG prototype. |
| `packages/ui` | `@cardioline/ui`, the shared Beat Design System primitives and tokens. |
| `docs` | Static Beat documentation published with GitHub Pages. |
| `CHANGELOG.md` | User-facing summary of completed prototype work. Update it for notable changes. |

## Working agreement

- Keep all product strings, code comments and documentation in English.
- Preserve the front-end prototype model: user, patient, examination and report data are mock data in `apps/vireo-arc/src/lib/mock-data.ts`.
- Prefer small domain components over large route files. Reuse an existing component before adding a near-duplicate.
- Use `@cardioline/ui` first. Add a reusable primitive to `packages/ui` when a missing ShadCN/Radix pattern will be reused.
- Use Lucide for icons. Icon-only buttons require an `aria-label`; this also supplies the application tooltip.
- Do not introduce native selects for product controls. Use the shared `Select` primitives from `@cardioline/ui`.
- Destructive actions must use `ConfirmDialog`; transient feedback must use `PrototypeToast`.
- Tables must retain the existing sorting, responsive horizontal scroll, sticky actions and no-wrap cell pattern.

## Local development

```bash
npm install
cd apps/vireo-arc
npm run type-check
npm run build
npm run dev
```

The production preview runs on port `3001`:

```bash
cd apps/vireo-arc
npm run start
```

After `npm run build`, restart the preview server before visual verification. `next start` can otherwise serve a stale CSS manifest.

## Validation checklist

1. Run `npm run type-check` and `npm run build` in `apps/vireo-arc`.
2. Verify the changed route on desktop and a narrow viewport.
3. Check navigation, empty/mock interactions, modal close controls, toast feedback and keyboard focus for the changed flow.
4. Update `CHANGELOG.md` when the change affects a visible product capability.

## Focused guides

- [Vireo Arc application guide](apps/vireo-arc/AGENTS.md)
- [Beat Design System guide](packages/ui/AGENTS.md)
