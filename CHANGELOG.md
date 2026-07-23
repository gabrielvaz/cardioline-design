# Changelog

All notable prototype UI changes are documented here.

## [Unreleased] - 2026-07-22

### Experimental

- Added a TanStack Table pilot for the exam list, preserving Beat table markup while moving sorting, global search, pagination and column visibility to the headless table engine.
- Added shared table settings for density and protected column visibility, plus advanced-search entry points for patients and reports.

### Added

- Added active component search to the Beat Design System documentation sidebar.
- Added the Exam Inbox as a clinical worklist with urgency rules, Cards/Table settings, and mock reassignment of examinations to reporting professionals.
- Added configurable pagination sizes (10, 20, 50 and 100) to paginated clinical lists.
- Complete mock flows for exam filtering, advanced search, reports, ECG and PDF report viewers.
- Patient creation and editing with a shared, fully populated form; patient and exam pagination, sorting, filters, actions and confirmation dialogs.
- Consolidated Settings navigation with account, configuration and administration areas for users, sites, groups, roles and devices.
- Reusable UI primitives for confirmations, toast feedback, sorting, pagination, selection checkboxes and Radix/ShadCN Select controls.
- Functional login recovery, mock administration creation dialogs, tooltip-enabled action buttons and responsive table navigation.

### Changed

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

### Fixed

- Fixed broken report and exam navigation paths, including patient-specific report actions.
- Fixed filter dropdown layering, small-screen table actions and inconsistent action-button widths.
- Removed save-button icons for consistent button treatment.
