# Beat Design System — Agent Guide

`@cardioline/ui` is the shared UI foundation for Cardioline products. It combines a compact Beat visual language with ShadCN-style composition and Radix primitives.

For the complete current component and block catalog, selection criteria, and
agent workflow, read [the Beat Design System agent reference](../../docs/BEAT-DESIGN-SYSTEM.md).

## Brand foundation

| Role | Value | Use |
| --- | --- | --- |
| Cardioline orange | `#ee5b00` | Primary actions, active navigation, emphasis and focus accents. |
| Deep navy | `#071046` | Page titles, strong text and dark identity surfaces. |
| Light blue | `#d8effc` | List/table hover state. |
| Neutral background | `#f8fafc` | Application canvas. |
| Border | `#e2e8f0` / slate-200 | Dividers and low-emphasis boundaries. |

Use Plus Jakarta Sans for headings and Inter for product UI. Keep interfaces clinically calm, dense enough for professional workflows and restrained in decoration.

## Existing primitives

| Component | Import | Notes |
| --- | --- | --- |
| Button | `Button` | Supports normal, outline, secondary, ghost, destructive and Beat styling. Use `size="icon"` only with `aria-label`. |
| Card | `Card`, `CardHeader`, `CardContent`, etc. | Use for grouped forms and settings sections, not as a default wrapper for every page. |
| Input and Label | `Input`, `Label` | Default field pair. |
| Select | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` | Radix/ShadCN selection pattern. Use instead of native `<select>` for interactive product controls. |
| Utility | `cn` | Merge conditional Tailwind classes. |

## Component API example

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cardioline/ui';

<Select value={view} onValueChange={setView}>
  <SelectTrigger aria-label="ECG format" className="min-w-[104px]">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="12x1">Format: 12×1</SelectItem>
    <SelectItem value="6x2">Format: 6×2</SelectItem>
  </SelectContent>
</Select>
```

## Contribution rules

1. Build new reusable primitives in `src/components/`; export them from `src/index.ts`.
2. Compose on top of Radix when accessibility, focus management, portals or keyboard support is required.
3. Keep API names aligned with ShadCN conventions when possible.
4. Prefer tokens and shared classes over a one-off color system.
5. Avoid custom component forks in application code when the primitive can be improved centrally.
6. Maintain visible focus states, semantic labels and keyboard navigation.

## Visual consistency checklist

- Primary CTA: orange surface with white text.
- Secondary/cancel: neutral surface or outline.
- Destructive CTA: red surface and confirmation dialog before the action.
- Table/list hover: full-row light-blue fill, never a left accent bar.
- Dropdowns: shared Select or existing filter dropdown, matching orange chevron and border behavior.
- Icon actions: square, equal-width targets; `aria-label` is mandatory.
- Toasts: centered near the lower edge, with the close icon aligned right.
