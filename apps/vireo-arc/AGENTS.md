# Vireo Arc — Application Guide

Vireo Arc is a single-tenant, front-end-only prototype for managing cardiac patients, examinations and reports. It uses mock data and deliberately does not implement authentication, persistence or patient-data integrations.

## Route groups

| Route | Responsibility |
| --- | --- |
| `/login`, `/forgot-password` | Mock authentication entry points. Any login is accepted. |
| `/dashboard` | Overview with clickable recent exams. |
| `/exams` | Filterable, sortable, paginated examination table. |
| `/exams/[id]` | Six-second loading gate followed by the ECG workspace. |
| `/patients`, `/patients/new`, `/patients/[id]`, `/patients/[id]/edit` | Patient list and shared create/edit/detail flows. |
| `/reports`, `/reports/[id]` | Report table and mock PDF report viewer. |
| `/settings/*` | Account, configuration, report settings and administration resources. |

## Architecture

```text
app/                         Route composition only
components/auth/             Login and recovery form UI
components/layout/           Dashboard shell, sidebar and top header
components/exams/            Filtering, loading and ECG workspace
components/patients/         Shared patient form and patient detail view
components/reports/          PDF-like report viewer
components/settings/         Settings navigation and generic admin resource UI
components/ui/               Feature-level reusable UI patterns
lib/mock-data.ts             Source of truth for prototype data
```

Keep route files thin. Put interactive state in the domain component that owns it, not in a page unless the state is route-specific.

## Navigation and shell rules

- Standard dashboard routes use `DashboardShell`, sidebar and header.
- Exam and report viewing routes may use the hidden-sidebar mode. They must not render the global patient-search header.
- The sidebar has `expanded`, `collapsed` and `hidden` modes. The hidden mode opens as a drawer above an overlay.
- Settings is one top-level navigation destination. Its internal navigation card owns account, configuration and administration sections.

## Data and mock behavior

- Use `patients`, `exams` and `reports` from `lib/mock-data.ts` for list/detail relationships.
- Map report actions by `examId`, not array position.
- New or edited records can remain in local component state; the prototype does not persist data after a refresh.
- Preserve the 20-patient and 30-exam datasets unless the requested scenario needs different coverage.

## Interaction conventions

- Use `SortableHeader` for table sorting and `TablePagination` for list pagination.
- Use `ExamFilterDropdown` for exam filter menus; it portals its content to avoid clipping beneath table/toolbars.
- Use `SelectionCheckbox` for filter choices. Do not replace it with browser-default checkboxes.
- Use `ConfirmDialog` before deleting an exam, patient or administration resource.
- Use `PrototypeToast` for mock success and state messages. Toastes appear centered near the bottom of the viewport.
- Every row-level action needs an icon button with an `aria-label` and a stable square hit target.

## ECG workspace details

- `ExamLoadingGate` remains visible for six seconds before `EcgViewer` renders.
- `EcgViewer` contains its own compact header and hamburger trigger; do not restore the global top header there.
- Lead measurements use a cross-hover state: row, column and intersection each have distinct light orange tones.
- Clinical and global measurement sidebars use full-row hover feedback.
- Control menus use the shared Radix/ShadCN Select primitive.
