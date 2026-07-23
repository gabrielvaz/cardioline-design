# Beat Design System: Agent Reference

This document is the implementation reference for the current public surface of
`@cardioline/ui`. It is written for agents working in this repository.

Use it together with [the package guide](../packages/ui/AGENTS.md). The static
site in `docs/index.html` is a visual catalog; this document explains selection,
composition, and repository-specific constraints.

## Quick start

```tsx
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cardioline/ui';
```

Import all shared UI from `@cardioline/ui`. Check
`packages/ui/src/index.ts` before using or documenting a public API.

## Architecture and ownership

| Layer | Location | Purpose | Rule |
| --- | --- | --- | --- |
| Tokens | `packages/ui/src/tokens` | Color, type, spacing, radius, shadow values | Consume semantic tokens rather than recreating the palette. |
| Primitives | `packages/ui/src/components` | Focused reusable controls, usually backed by Radix | Use these first. |
| Blocks | `packages/ui/src/blocks` | Generic compositions of primitives | Do not embed Vireo data, routes, or copy. |
| Product composition | `apps/vireo-arc/src/components` | Clinical screens and domain behavior | Keep mock data and navigation here. |

The proposed blocks documented in `docs/superpowers/` are not automatically
part of the package. The **Current blocks** section below is the actual public
inventory.

## Design and implementation rules

- Use Plus Jakarta Sans for headings and Inter for product UI through the
  supplied global styles.
- Use Cardioline orange for primary actions and active emphasis. Keep one
  primary call to action per page area when possible.
- Use `bg-card`, `bg-popover`, `bg-background`, `text-foreground`,
  `text-muted-foreground`, and `border-border` instead of hard-coded colors.
- Use Lucide for icons. An icon-only `Button` requires `aria-label`; the Button
  uses it as the native tooltip label.
- Use `Select`, never a native `<select>`, for interactive product choices.
- Use Vireo's `ConfirmDialog` for destructive flows and `PrototypeToast` for
  transient feedback. Both compose the shared primitives.
- Keep clinical table cells on one line by default, preserve horizontal scroll
  and sticky Actions on small screens, and reveal clipped values in a tooltip.
- Test in light and dark mode. Do not solve dark-mode contrast by adding raw
  light backgrounds or orange table stripes.

## Primitives

### Button

**Import:** `Button`, `buttonVariants`, `ButtonProps`

Use for an explicit user action. It supports `asChild` when a semantic link
needs Button styling.

| Variant | Use for |
| --- | --- |
| `default` | The page or section primary action. |
| `secondary` | Neutral supporting actions, including cancellation. |
| `outline` | Secondary actions that should remain visible without competing with the CTA. |
| `ghost` | Low-emphasis actions in a compact toolbar or row. |
| `destructive` | An action that leads to a destructive confirmation. |
| `link` | Inline navigation or a low-weight text action. |

| Size | Use for |
| --- | --- |
| `sm`, `default`, `lg`, `xl` | Match action hierarchy and available space. |
| `icon` | A square icon-only target. Always provide `aria-label`. |

```tsx
<Button><Plus /> Add patient</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost" size="icon" aria-label="Edit patient">
  <Pencil />
</Button>
```

Do not create an app-local button class when one of these variants fits.

### Input and Label

**Import:** `Input`, `Label`

Use for text-like fields: search, email, date, password, numeric values, and
mock form data. Pair every Input with a `Label` using `htmlFor` and `id`, except
when a visible accessible label is supplied by an established composite.

```tsx
<div className="grid gap-2">
  <Label htmlFor="patient-email">Email address</Label>
  <Input id="patient-email" type="email" placeholder="name@hospital.com" />
</div>
```

Use `type`, `disabled`, `required`, `aria-describedby`, and native validation
attributes as appropriate. Do not substitute placeholder text for a label.

### Select

**Import:** `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`,
`SelectItem`

Use for one item from a discrete set: density, summary status, study format, or
page size. It is a Radix selection control with an accessible keyboard model
and shared orange chevron.

```tsx
<Select value={density} onValueChange={setDensity}>
  <SelectTrigger aria-label="Table density" className="min-w-36">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="compact">Compact</SelectItem>
    <SelectItem value="comfortable">Comfortable</SelectItem>
    <SelectItem value="spacious">Spacious</SelectItem>
  </SelectContent>
</Select>
```

Do not use a native `<select>` for product controls. Use a checkbox list or
`MultiSelectDropdown` when the user can select multiple values.

### Checkbox

**Import:** `Checkbox`

Use for independent, multi-select choices such as filters, visible table
columns, or consent. It supports checked, unchecked, and Radix indeterminate
state. Place it inside a visible `<label>` when the text should toggle it.

```tsx
<label className="flex items-center gap-3">
  <Checkbox checked={showUnit} onCheckedChange={setShowUnit} />
  Show unit
</label>
```

Do not use a Switch for a deferred multi-select form choice.

### Switch

**Import:** `Switch`, `SwitchProps`

Use for an immediate binary preference or system setting such as dark mode,
WebChat enablement, or notification behavior. It exposes `role="switch"`,
`aria-checked`, `checked`, `defaultChecked`, and `onCheckedChange`.

```tsx
<Switch
  checked={isDark}
  onCheckedChange={setIsDark}
  aria-label="Enable dark mode"
/>
```

Do not use a Switch for a field that needs explicit Save semantics, or where
the action is dangerous.

### Badge

**Import:** `Badge`, `badgeVariants`, `BadgeProps`

Use a Badge for a compact, non-interactive status or attribute. It is not a
button and should not contain a primary action.

| Variant | Use for |
| --- | --- |
| `default` | Brand or selected context. |
| `secondary`, `neutral`, `outline` | Low-emphasis labels. |
| `success` | Normal, active, approved, or online state. |
| `warning` | Borderline, pending attention, or elevated state. |
| `destructive` | Abnormal, critical, rejected, or unavailable state. |

```tsx
<Badge variant="destructive">Abnormal</Badge>
<Badge variant="success">Online</Badge>
```

### Card family

**Import:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`,
`CardContent`, `CardFooter`

Use a Card for a meaningful group such as a settings form, a dashboard unit, a
featured inbox examination, or a rich preview. Do not wrap every page section
in a Card; table/list pages should retain their own structural treatment.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Notification preferences</CardTitle>
    <CardDescription>Choose the alerts shown in your worklist.</CardDescription>
  </CardHeader>
  <CardContent>{/* fields */}</CardContent>
  <CardFooter className="justify-end"><Button>Save changes</Button></CardFooter>
</Card>
```

### Tabs

**Import:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`

Use for peer content panels that are available in the same route and share
context, such as the sub-sections of a settings screen. The active tab uses the
orange underline.

```tsx
<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">...</TabsContent>
  <TabsContent value="security">...</TabsContent>
</Tabs>
```

Use route navigation instead when each destination needs its own URL, deep
link, lifecycle, or access rule.

### Dialog family

**Import:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`,
`DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`

Use for a focused, non-destructive task: advanced search, template selection,
assignment, creation, or edit details. `DialogContent` already creates a portal
and overlay and displays an accessible close icon by default. Pass
`showClose={false}` only when the flow supplies an equally clear close path.

Dialog overlay and content use the shared 200 ms eased fade on open and close;
do not add a competing local animation.

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Assign examination</DialogTitle>
      <DialogDescription>Choose a reporting professional.</DialogDescription>
    </DialogHeader>
    {/* dialog content */}
    <DialogFooter><Button onClick={assign}>Assign</Button></DialogFooter>
  </DialogContent>
</Dialog>
```

Do not build fixed-position overlays in feature code.

### AlertDialog family

**Import:** `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`,
`AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`,
`AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel`

Use only when an action is consequential or irreversible. In Vireo Arc, prefer
the local `ConfirmDialog` wrapper so destructive copy, labels, and callbacks
stay consistent.

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete patient</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Never execute a destructive mock action without confirmation.

### DropdownMenu family

**Import:** `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`,
`DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`,
`DropdownMenuGroup`, `DropdownMenuPortal`

Use for compact contextual actions such as a user menu, row actions, overflow
actions, or a short menu of related commands. Use `DropdownMenuItem` with
`destructive` for a destructive item, followed by a confirmation dialog.

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon" variant="ghost" aria-label="Patient actions"><MoreHorizontal /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={openEdit}><Pencil /> Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive onSelect={openConfirm}><Trash2 /> Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

Use `Select` for a persistent choice and Dialog for a task needing substantial
content.

## Current blocks

### MultiSelectDropdown

**Import:** `MultiSelectDropdown`, `MultiSelectOption`

Use for grouped multi-select filters with a checkbox list, selected-count
summary, Clear action, and Done action. Current option shape:

```ts
type MultiSelectOption = {
  label: string;
  value?: string;
  group?: string;
};
```

```tsx
<MultiSelectDropdown
  label="Exam type"
  options={examTypeOptions}
  value={selectedExamTypes}
  onChange={setSelectedExamTypes}
  align="start"
/>
```

Use this block instead of creating a page-specific filter popover when the
behavior matches. Pass a custom `summary` only when the normal selected count is
not sufficiently clear. The `value` holds each option's `value ?? label`.

## Tokens and utilities

### Tokens

**Import:** `cardiolineColors`, `semanticColors`, `typography`, `spacing`,
`borderRadius`, `shadows`

Use TypeScript tokens for documentation, configuration, and non-Tailwind
consumers. Use the semantic Tailwind/CSS token classes in JSX:

| Intent | Prefer |
| --- | --- |
| Page canvas | `bg-background text-foreground` |
| Grouped surface | `bg-card text-card-foreground border-border` |
| Floating surface | `bg-popover text-popover-foreground border-border` |
| Primary emphasis | `bg-primary text-primary-foreground` |
| Muted supporting text | `text-muted-foreground` |
| Focus indication | `ring-ring` or the primitive focus behavior |
| Destructive state | `bg-destructive text-destructive-foreground` |

The dark theme is driven by the `.dark` class and the same semantic variables.
Do not add a second palette in feature code.

### `cn`

**Import:** `cn`

Use `cn` to merge conditional Tailwind classes in reusable components. It
combines `clsx` and Tailwind conflict resolution.

```tsx
className={cn('rounded-md border-border', isActive && 'bg-primary text-primary-foreground')}
```

## Vireo Arc conventions built on Beat

These patterns are application-level conventions, not currently exported Beat
blocks:

| Pattern | Use |
| --- | --- |
| `ConfirmDialog` | Any delete or irreversible mock operation. |
| `PrototypeToast` | Transient result of save, filter, assignment, or other interaction. Keep it centered near the lower viewport edge with the close icon right-aligned. |
| Table settings | Density and column visibility. Preserve user preference via the existing global density hook. |
| Clinical tables | Sortable headers, no-wrap default cells, horizontal scroll, sticky Actions, row hover, and tooltips for truncation. |
| `PageHeader` | Shared title/subtitle hierarchy across clinical workspace pages. |

When one of these patterns becomes generic and demonstrably reusable beyond
Vireo Arc, promote it to `packages/ui/src/blocks`, export it, and add it to this
document.

## Change checklist

1. Read `packages/ui/AGENTS.md` and this file before selecting or changing UI.
2. Reuse an exported primitive or block before adding a local copy.
3. For a reusable addition, build it under `packages/ui/src`, export it from
   `src/index.ts`, and document it here.
4. Check keyboard behavior, focus, labels, dark contrast, tooltip text, and
   narrow-screen behavior.
5. Run `cd apps/vireo-arc && npm run type-check` and `npm run build` for
   visible application changes.
6. Update `CHANGELOG.md` for material visible product capability.
