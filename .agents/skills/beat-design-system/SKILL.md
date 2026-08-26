---
name: beat-design-system
description: Implement, review, document, or refactor Cardioline interfaces using the Beat Design System in this repository. Use when working in packages/ui, consuming @cardioline/ui in Vireo ARK, choosing a component or block, changing tokens or dark mode, or enforcing Beat accessibility and table conventions.
---

# Beat Design System

Use Beat as the shared UI foundation. Prefer an exported primitive before
building app-local UI; add a primitive or block only when it is generic,
reused, and not tied to Vireo ARK data or routing.

## Read first

1. Read `packages/ui/AGENTS.md` for the visual and accessibility rules.
2. Read `docs/BEAT-DESIGN-SYSTEM.md` for the current exported component and
   block catalog. Treat that catalog as the source of truth, not proposed
   blocks described in `docs/superpowers/`.
3. Inspect `packages/ui/src/index.ts` before adding an import or documenting a
   public API.

## Selection guide

| Need | Use | Do not use |
| --- | --- | --- |
| Primary, secondary, inline, destructive, or icon action | `Button` | A hand-styled `<button>` when the shared variant fits |
| Text, date, email, password, or numeric field | `Input` with `Label` | Native styling or an unlabeled field |
| Single choice in a product control | `Select` | Native `<select>` |
| Multiple independent choices | `Checkbox` | A fake checkbox or a toggle for multi-select |
| Immediate on/off preference | `Switch` | Checkbox when the control acts immediately |
| Compact status | `Badge` | A Button used as a label |
| Tabbed peer views | `Tabs` | Route navigation disguised as local tabs |
| Non-destructive focused interaction | `Dialog` | A custom fixed overlay |
| Irreversible action | `AlertDialog` through Vireo `ConfirmDialog` | A `Dialog` or direct destructive action |
| Contextual row/account actions | `DropdownMenu` | A visible collection of small icon buttons |
| Grouped selectable filters | `MultiSelectDropdown` | A new hand-rolled portal/checklist |

## Required implementation rules

- Import public UI through `@cardioline/ui`; export any newly reusable package
  API from `packages/ui/src/index.ts`.
- Use Lucide icons. Give every icon-only Button an `aria-label`; Beat promotes
  that label to the native tooltip.
- Use `Select` for product controls. Do not introduce a native `<select>`.
- Compose dialogs with the shared primitives. They provide focus management,
  portal behavior, Escape/outside dismissal, and the standard 200 ms eased fade.
- Use Vireo `ConfirmDialog` for destructive actions and `PrototypeToast` for
  transient feedback.
- Preserve clinical tables: horizontal overflow on narrow screens, sticky
  actions, sortable headers, no-wrap default cells, full-row hover, and a
  tooltip for truncated content.
- Keep dark mode semantic: `bg-card`, `bg-popover`, `text-foreground`,
  `text-muted-foreground`, `border-border`, and semantic Badge variants. Do
  not introduce raw light colors to solve a local contrast issue.
- Keep blocks generic: no mock data, route paths, product copy, or Vireo-only
  state inside `packages/ui/src/blocks`.

## Delivery workflow

1. Reuse the narrowest fitting primitive or block from the catalog.
2. Keep application/domain composition in `apps/vireo-arc/src/components`.
3. Add a package primitive/block only after confirming at least two reusable
   product contexts or a clear cross-product need.
4. Verify keyboard focus, labels, visible focus rings, light/dark contrast,
   narrow-table behavior, and modal/toast feedback.
5. Run `cd apps/vireo-arc && npm run type-check` and `npm run build` for
   visible product changes. Update `CHANGELOG.md` for notable UI capability.

## Documentation maintenance

When changing an exported component, block, token, variant, or interaction,
update `docs/BEAT-DESIGN-SYSTEM.md` in the same change. Keep the entry factual:
public import, purpose, when to use it, key props/variants, accessibility
requirements, and at least one concise composition example when useful.
