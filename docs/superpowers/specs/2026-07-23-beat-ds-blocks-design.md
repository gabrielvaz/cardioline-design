# Beat Design System — Blocks layer (design spec)

Date: 2026-07-23
Status: proposed (awaiting review)

## Context

Beat Design System (`@cardioline/ui`) is meant to be the source of truth for
Cardioline products, starting with Vireo Arc. In practice, larger composite
components have been evolving inside Vireo Arc (filter dropdowns, table
settings, sidebar shell, confirmation dialogs, row action menus) and the app,
not the DS, has become the "better" version. This spec reverses that: the DS
gains a curated second layer of composite components ("Blocks"), the app
consumes them, and the local duplicates are removed.

## Goals

- Establish two clear layers in Beat: primitives and Blocks.
- Port the composite components that are worth reusing across future systems,
  generalized so they carry no Vireo-specific data or routing.
- Document the Blocks under a new "Blocks" category in the Beat docs.
- Make Vireo Arc consume the Blocks from `@cardioline/ui` and delete the local
  copies, so Beat is the single source of truth.
- Keep the ShadCN model intact so the DS stays updatable: Blocks only compose
  primitives, primitives only wrap Radix.

## Non-goals

- No visual redesign of the components; behavior and look stay equivalent.
- No new product features in Vireo Arc.
- No exhaustive live documentation for every state in this first pass (concise
  preview per Block now; deeper demos later).

## Architecture: two layers

- **Primitives** — `packages/ui/src/components/`. Single-purpose, wrap Radix.
  Existing: Button, Input, Label, Select, Checkbox, Switch, Tabs, Dialog,
  AlertDialog, DropdownMenu, Badge, Card.
- **Blocks** — `packages/ui/src/blocks/` (new). Composite, ready-to-use, generic
  components built only from primitives. Exported from the same
  `@cardioline/ui` entrypoint (organization lives in the folder split, not in
  the import path).

### Rules for Blocks (conscious ShadCN use)

1. A Block composes primitives; it never re-implements a Radix behavior a
   primitive already provides.
2. No application data, routes, or copy baked in — everything arrives through
   props or slots.
3. Tokens only; no hardcoded hex.
4. Accessibility (focus trap, keyboard, portals, dismissal) comes from the
   underlying Radix primitives.
5. `cva` for variants, `cn` for class merging, `asChild`/render-slots where the
   consumer needs to inject its own element (e.g. `next/link`).

## Blocks in this first batch

### 1. MultiSelectDropdown
Generic multi-select dropdown with grouped, checkbox options and a Clear/Done
footer plus a selected-count summary. Built on DropdownMenu + Checkbox.

```
type MultiSelectOption = { label: string; value?: string; group?: string };
MultiSelectDropdown({
  label: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  align?: 'start' | 'end';
  summary?: (count: number) => string;   // default ": N selected"
  triggerClassName?: string;
})
```
Replaces Vireo `ExamFilterDropdown`, dropping its hand-rolled portal
positioning in favor of Radix DropdownMenu (outside-click, keyboard, portal).

### 2. TableToolbarMenu
Table settings menu: column visibility (with locked columns), density, and an
optional Cards/Table view toggle. Built on DropdownMenu + Checkbox + a small
segmented control.

```
type TableColumnSetting = { id: string; label: string; locked?: boolean };
type TableDensity = 'compact' | 'comfortable' | 'spacious';
TableToolbarMenu({
  columns: TableColumnSetting[];
  visibleColumns: string[];
  onVisibleColumnsChange: (columns: string[]) => void;
  density: TableDensity;
  onDensityChange: (density: TableDensity) => void;
  view?: { value: 'cards' | 'table'; onValueChange: (v: 'cards' | 'table') => void };
})
```
Moves Vireo `TableSettingsMenu` into Beat, largely as-is (already generic).

### 3. ConfirmDialog (Dialog/Modal block)
Destructive confirmation built on AlertDialog. Documents the modal pattern.

```
ConfirmDialog({
  open: boolean;
  title: string;
  description: string;      // caller states the action is irreversible
  confirmLabel?: string;    // default "Delete"
  destructive?: boolean;    // default true
  onCancel: () => void;
  onConfirm: () => void;
})
```
Promotes the Vireo `ConfirmDialog` into Beat.

### 4. RowActionsMenu
Row "more" (kebab) menu that always ends in a Delete item, which opens a
ConfirmDialog before the permanent action. Generic (no `entity` coupling).

```
type RowAction = { icon?: LucideIcon; label: string; onSelect: () => void };
RowActionsMenu({
  name: string;                 // used for the trigger aria-label
  actions?: RowAction[];        // optional items above Delete
  deleteLabel?: string;         // default "Delete"
  confirmTitle: string;
  confirmDescription: string;   // caller states irreversibility
  onDelete: () => void;
})
```
Promotes the Vireo `RowActionsMenu`, generalized (title/description as props).

### 5. AppSidebar (shell)
Collapsible application sidebar with three modes: expanded, collapsed, and
hidden (opens as a drawer overlay via hamburger). Slot-driven so the app owns
its nav, logo and footer, and can render `next/link`.

```
type SidebarItem = { label: string; href: string; icon: LucideIcon; active?: boolean };
type SidebarMode = 'expanded' | 'collapsed' | 'hidden';
AppSidebar({
  mode: SidebarMode;
  onModeChange: (mode: SidebarMode) => void;
  items: SidebarItem[];
  logo: React.ReactNode;
  footer?: React.ReactNode;
  drawerOpen?: boolean;
  onDrawerOpenChange?: (open: boolean) => void;
  renderLink?: (item: SidebarItem, content: React.ReactNode) => React.ReactNode; // inject next/link
})
```
Replaces Vireo `Sidebar`. The DS owns the shell and the three-mode interaction;
the app passes nav config, brand logo and a `renderLink` that wraps items in
`next/link`, plus active-state via `usePathname`.

## Migration (Vireo Arc consumes Beat)

| Vireo file (removed/thinned) | Becomes |
| --- | --- |
| `components/exams/exam-filter-dropdown.tsx` | Beat `MultiSelectDropdown` (app passes exam options) |
| `components/ui/table-settings-menu.tsx` | Beat `TableToolbarMenu` (re-export the local `TableDensity` type from Beat) |
| `components/ui/confirm-dialog.tsx` | Beat `ConfirmDialog` |
| `components/ui/row-actions-menu.tsx` | Beat `RowActionsMenu` |
| `components/layout/sidebar.tsx` | Beat `AppSidebar` + a thin app wrapper holding the Vireo nav/logo/`next/link` |
| `components/ui/selection-checkbox.tsx` | Folded into `MultiSelectDropdown`; remaining call sites use the `Checkbox` primitive |

Consumers that import these (`exams`, `patients`, `reports`, `tanstack-exam-table`,
`admin-resource-page`, `patient-detail-view`, `dashboard-shell`, `inbox`) switch
their imports to `@cardioline/ui`.

## Docs changes (`docs/index.html`)

- Add a **Blocks** category to the sidebar, after **Components**.
- One concise section per Block: short description, a single representative
  preview, and a minimal props note. Light and dark aware, tokens only.

## Phasing

1. Scaffold `packages/ui/src/blocks/` and the docs "Blocks" category shell.
2. `MultiSelectDropdown` + `TableToolbarMenu`: build, migrate the app, document.
3. `ConfirmDialog` + `RowActionsMenu`: build, migrate the app, document.
4. `AppSidebar`: build, migrate the app, document.

Each phase ends green: `type-check` and `build` pass, and the changed routes are
exercised on the dev server.

## Risks and mitigations

- **AppSidebar generalization is the largest change.** Mitigate by keeping the
  three-mode logic identical and isolating Vireo specifics behind `renderLink`,
  `items`, `logo`, `footer`. Done last, on its own phase.
- **Radix DropdownMenu vs the old manual portal** in the filter dropdown may
  shift positioning/scroll behavior. Verify against the exams filter bar.
- **Static HTML docs** can drift from the React components. Keep doc previews
  minimal and token-driven to reduce upkeep.
