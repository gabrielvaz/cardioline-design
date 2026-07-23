# Changelog

All notable prototype UI changes are documented here.

## [Unreleased] - 2026-07-22

### Experimental

- Added a TanStack Table pilot for the exam list, preserving Beat table markup while moving sorting, global search, pagination and column visibility to the headless table engine.
- Added shared table settings for density and protected column visibility, plus advanced-search entry points for patients and reports.

### Added

- Complete mock flows for exam filtering, advanced search, reports, ECG and PDF report viewers.
- Patient creation and editing with a shared, fully populated form; patient and exam pagination, sorting, filters, actions and confirmation dialogs.
- Consolidated Settings navigation with account, configuration and administration areas for users, sites, groups, roles and devices.
- Reusable UI primitives for confirmations, toast feedback, sorting, pagination, selection checkboxes and Radix/ShadCN Select controls.
- Functional login recovery, mock administration creation dialogs, tooltip-enabled action buttons and responsive table navigation.

### Changed

- Refined the exam workspace: hidden navigation on exam views, ECG loading state, interactive lead measurements and clinical sidebar states.
- Standardized table headers, row hover behavior, controls, dropdowns, checkboxes and destructive-action confirmation patterns across the prototype.
- Improved sidebar states (expanded, compact and drawer), navigation organization and Cardioline logo sizing.
- Updated reports to use tables and enhanced PDF report preview interactions.

### Fixed

- Fixed broken report and exam navigation paths, including patient-specific report actions.
- Fixed filter dropdown layering, small-screen table actions and inconsistent action-button widths.
- Removed save-button icons for consistent button treatment.
