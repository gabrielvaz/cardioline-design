# Changelog

All notable prototype UI changes are documented here.

## [Unreleased] - 2026-07-25

### Experimental

- Added a TanStack Table pilot for the exam list, preserving Beat table markup while moving sorting, global search, pagination and column visibility to the headless table engine.
- Added shared table settings for density and protected column visibility, plus advanced-search entry points for patients and reports.

### Added

- Added a client-side prototype store (`lib/prototype-data.tsx`) that seeds from the mock dataset and persists every change to localStorage: patient creation/editing/deletion (with cascade to exams, inbox entries and reports), exam registration and deletion, inbox assignment, and report conclusion/summary edits now survive page refreshes.
- Added a "New ECG" acquisition dialog on the patient detail page that registers a mock examination for the current patient and opens its ECG workspace, replacing the previous hardcoded link to another patient's exam.
- Added a "Restore demo data" action (Settings → Profile) that reseeds the prototype store with the original mock dataset.
- Added distinct SVG favicons for the Vireo Arc application and Beat Design System documentation.
- Added Dashboard Exam Inbox and weekly operational analytics widgets, including mock exam/report volume and median report-time trends.
- Reused the searchable reporting-professional assignment dialog from Exam Inbox in the main exam list.
- Added patient editing directly from the ECG workspace, plus a format choice before saving an examination.
- Added a Beat Design System "Blocks" layer (MultiSelectDropdown, TableToolbarMenu, ConfirmDialog, RowActionsMenu, AppSidebar): generic, slot-driven composites now consumed by Vireo Arc, with the local duplicates removed so Beat is the single source of truth.
- Added a repository-local Beat Design System skill and Markdown component catalog for agent consumption.
- Added active component search to the Beat Design System documentation sidebar.
- Added the Exam Inbox as a clinical worklist with urgency rules, Cards/Table settings, and mock reassignment of examinations to reporting professionals.
- Added configurable pagination sizes (10, 20, 50 and 100) to paginated clinical lists.
- Complete mock flows for exam filtering, advanced search, reports, ECG and PDF report viewers.
- Patient creation and editing with a shared, fully populated form; patient and exam pagination, sorting, filters, actions and confirmation dialogs.
- Consolidated Settings navigation with account, configuration and administration areas for users, sites, groups, roles and devices.
- Reusable UI primitives for confirmations, toast feedback, sorting, pagination, selection checkboxes and Radix/ShadCN Select controls.
- Functional login recovery, mock administration creation dialogs, tooltip-enabled action buttons and responsive table navigation.
- Added hover tooltips to the Dashboard weekly volume and median report-time charts, surfacing the underlying exam, report and timing figures per week.
- Added a "Generated at" filter (Yesterday, Last 3 days, Last 7 days, Previous week, Previous month, All time) to the Reports list.
- Added a mouse-resizable divider between the ECG lead measurements table and the waveform strips, plus a collapsible clinical panel on the ECG workspace.
- Added Age, Weight, Height and Blood pressure as editable fields on patient creation and editing.
- Added a clinical UX density audit of the Beat Design System, comparing research-backed best practices for high-density clinical software against the current implementation (`docs/audits/`).

### Changed

- Made the Dashboard "Total exams" and "New patients" metric cards clickable and sourced from live prototype data, with empty states for the inbox and recent-reports widgets.
- Redesigned the sign-in and password-recovery routes as a split-screen layout with a deep-navy brand panel (Vireo ARC wordmark, animated ECG trace with reduced-motion fallback) and a semantic-token form that now fully supports dark mode.
- Made the ECG waveform dynamically use the available viewport height when measurements are hidden.
- Replaced the ECG save-format dropdown with selectable format cards for faster visual comparison.
- Made the Beat sidebar collapse and expand with a smoother transition while keeping the Vireo ARC wordmark stable.
- Increased the ECG workspace's vertical density on large displays and refined lead-table hover behavior.
- Refined the sign-in card with a slow moving brand border, expanded breathing room, Vireo ARC wordmark, and a persistent theme toggle.
- Standardized Vireo Arc modal and confirmation-dialog transitions with an eased fade for opening and closing.
- Updated Beat documentation buttons to demonstrate leading Lucide icons and removed decorative toast side rails.
- Reorganized clinical list controls so search, ordering, advanced search and filters follow a consistent workflow hierarchy.
- Improved Exam Inbox featured-card hierarchy and dark-mode surface contrast.
- Unified the Dashboard, Inbox, Patients, Exams, Reports, Settings and ECG workspace page headers through a shared title and subtitle treatment.
- Updated sidebar branding to present Vireo ARC in the navigation header and Cardioline alongside the signed-in professional.
- Made Spacious table density allow multi-line values instead of truncating clinical data.
- Simplified the Exam Inbox card view to a single-column clinical worklist with neutral row actions and no decorative side rail.
- Refined the exam workspace: hidden navigation on exam views, ECG loading state, interactive lead measurements and clinical sidebar states.
- Standardized table headers, row hover behavior, controls, dropdowns, checkboxes and destructive-action confirmation patterns across the prototype.
- Improved sidebar states (expanded, compact and drawer), navigation organization and Cardioline logo sizing.
- Updated reports to use tables and enhanced PDF report preview interactions.
- Fixed the Dashboard median report-time chart rendering its data points as ellipses instead of circles.
- Reworked the Patients date-of-birth and last-exam filters to show the active value inside the trigger, with the date range picked from a modal instead of inline inputs.
- Made page navigation scroll the content area back to the top instead of preserving the previous scroll position.
- Softened the Dashboard chart entrance and hover animations and removed the divider lines between Exam Inbox and Recent Reports list items.
- Removed gray page backgrounds across the Vireo Arc shell and ECG workspace in favor of white.
- Made the ECG lead measurements table show all rows without wrapping the row labels onto two lines.

### Fixed

- Made the exam list filters functional: Period, Exam type, Status, Summary, STAT, Pediatric and Units selections now filter the table when "Apply filter" is pressed (AND across categories, OR inside each), and "Clear all" resets both the draft and the applied filters.
- Made Advanced Search apply real criteria on Exams (grouped selections), Patients (date-of-birth buckets, last-exam period, status) and Reports (type, generated date, status), with toast feedback.
- Made the ECG workspace gain (mm/mV) and paper speed (mm/s) controls rescale the rendered waveform amplitude and duration.
- Fixed broken navigation and mock-data integrity across the prototype: the Exams "Report area" button now opens the Reports area, header notifications deep-link to the referenced exam, and the header patient search reapplies while already on the Patients page.
- Unknown patient, exam and report URLs now render a styled 404 page instead of silently showing the first mock record, and the report download endpoint returns 404 for unknown reports.
- Aligned the Exam Inbox worklist with the exam and patient mock sets so every inbox item opens the ECG of the same patient it describes.
- Removed the orphaned stand-alone Users section (duplicated by Settings → Administration → Users and unreachable from navigation) and the unused ECG background component.
- Fixed broken report and exam navigation paths, including patient-specific report actions.
- Fixed filter dropdown layering, small-screen table actions and inconsistent action-button widths.
- Removed save-button icons for consistent button treatment.
