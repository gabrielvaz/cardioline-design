# Cardioline Design Monorepo

Welcome to the official Cardioline monorepo hosting the **Beat Design System** (`@cardioline/ui`) and **Vireo ARK**, a modern front-end web prototype for ECG / Electrocardiogram workflow management.

---

## 📌 What is this repository?

This repository is the central frontend monorepo for Cardioline digital product interfaces. It contains:
1. **`@cardioline/ui` (Beat Design System)**: A shared React UI component library based on Radix UI primitives and Tailwind CSS.
2. **`vireo-arc`**: A Next.js 15 web application prototype designed for cardiac exam acquisition, reading, interpretation, patient management, and diagnostic reporting.
3. **`docs`**: Static documentation site for the Beat Design System (published via GitHub Pages).

---

## 🛠 Tech Stack

- **Monorepo Architecture**: [Turborepo](https://turbo.build/) + [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (v5.6)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) with `tailwindcss-animate`
- **UI Primitives**: [Radix UI](https://www.radix-ui.com/) (Accordion, Dialog, Select, Dropdown Menu, Tabs, Toast, Tooltip, etc.)
- **Design Tokens & System**: Custom **Beat Design System** guidelines built over `shadcn/ui` foundation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Tables**: [@tanstack/react-table](https://tanstack.com/table/v8)

---

## 📦 Project Structure & Apps

```text
cardioline-design/
├── apps/
│   └── vireo-arc/              # Next.js 15 ECG workflow prototype application
├── packages/
│   └── ui/                     # Beat Design System shared component library (@cardioline/ui)
├── docs/                       # GitHub Pages static documentation for Beat Design System
├── turbo.json                  # Turborepo task pipeline configuration
└── package.json                # Root package configuration & workspace definition
```

---

## 🎨 Beat Design System (`@cardioline/ui`)

The **Beat Design System** provides accessible, consistent, and accessible UI components designed specifically for Cardioline medical interfaces.

### Key Brand Tokens
- **Primary Color**: Vibrant Orange (`#ee5b00`)
- **Accent / Dark Backgrounds**: Deep Navy (`#071046`)
- **Headings Font**: *Plus Jakarta Sans*
- **Body Font**: *Inter*

### Shared Components & Primitives Included
- **Action & Controls**: `Button`, `Checkbox`, `Switch`, `Select` (Radix customized)
- **Layout & Structure**: `Card` (Header, Title, Description, Content, Footer), `Tabs`
- **Inputs & Data Entry**: `Input`, `Label`
- **Overlays & Dialogs**: `Dialog`, `AlertDialog` (for destructive actions), `DropdownMenu`
- **Feedback & Status**: `Badge` (Status indicators: emergency, pending, completed)

---

## 🖥 Vireo ARK Application (`apps/vireo-arc`)

**Vireo ARK** is a front-end ECG prototype simulating a full cardiology clinical workflow. All data (patients, exams, reports, users) is driven by mock datasets in `src/lib/mock-data.ts`.

### 📄 Pages & Routes

| Route | Page | Description |
| --- | --- | --- |
| `/login` | **Login Page** | User authentication entry point. |
| `/forgot-password` | **Password Reset** | Flow for recovering lost user credentials. |
| `/dashboard` | **Clinical Dashboard** | Overview of pending ECG exams, quick stats, emergency alerts, and recent activities. |
| `/exams` | **ECG Exam List** | Table view of all cardiac exams with sorting, filtering by status, search, and action menus. |
| `/exams/[id]` | **ECG Exam Viewer** | High-fidelity ECG wave reader, interpretation tool, measurements, and diagnostic submission. |
| `/patients` | **Patient Directory** | List of registered patients, patient history, and quick access to individual medical records. |
| `/patients/[id]` | **Patient Details** | Detailed view of patient demographic data, past ECG exams, and medical history. |
| `/reports` | **Diagnostic Reports** | List of finalized diagnostic reports with export (PDF print preview) options. |
| `/users` | **User Management** | System administration panel to manage clinicians, cardiologists, and staff permissions. |
| `/settings` | **App Settings** | System configuration, display preferences, unit preferences, and profile settings. |

### 🔄 Main User Flows & Workflows

1. **Authentication Flow**:
   - User signs in via `/login` -> Redirected to `/dashboard`.
   - Option to recover access via `/forgot-password`.

2. **ECG Exam Reading & Interpretation Flow**:
   - Clinician opens `/exams` table to view arriving ECGs.
   - Selects an exam to enter `/exams/[id]`.
   - Reviews multi-lead ECG waveforms, rhythm strips, automated measurement values (HR, PR, QRS, QT/QTc).
   - Enters diagnostic impression / cardiologist notes and finalizes report status.

3. **Patient Centric Flow**:
   - Search patient by name or ID in `/patients`.
   - Access `/patients/[id]` to review historical ECG traces and trace progress over time.

4. **Report Generation & Export Flow**:
   - Access `/reports` to inspect validated ECG diagnoses.
   - Filter by date or clinician, download, or trigger print views.

---

## ⚡ Instructions to Run Locally

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **npm**: `>= 10.0.0`

### 1. Install Dependencies
Run the following command at the root directory:

```bash
npm install
```

### 2. Development Mode
To start all apps and packages in development mode simultaneously via Turborepo:

```bash
npm run dev
```

To run **Vireo ARK** specifically on port `3001`:

```bash
cd apps/vireo-arc
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 3. Production Build & Preview

```bash
# Build all apps and packages
npm run build

# Start production server for Vireo ARK (Port 3001)
cd apps/vireo-arc
npm run start
```

### 4. Type Check & Validation

```bash
# Run TypeScript type check across monorepo
npm run type-check
```

---

## 📋 Dependencies Summary

### Monorepo Dependencies
- `turbo` - Monorepo task orchestration.
- `typescript` - Static type checking.
- `rimraf` - Cross-platform cleaning utility.

### App Dependencies (`vireo-arc`)
- `next` (v15.1) - React framework for server rendering and routing.
- `react` / `react-dom` (v19) - Core UI library.
- `@tanstack/react-table` - Headless data table rendering with sorting and pagination.
- `lucide-react` - Icon library.
- `tailwindcss`, `autoprefixer`, `postcss` - Utility-first CSS styling.
- `@cardioline/ui` - Local workspace package dependency.

### UI Package Dependencies (`@cardioline/ui`)
- `@radix-ui/*` - Unstyled, accessible component primitives (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, label, progress, select, separator, slot, tabs, toast, tooltip).
- `class-variance-authority` (cva) - Component variant management.
- `clsx` & `tailwind-merge` - Dynamic class name resolution.

---

## 📝 Guidelines

All code, commit messages, documentation and UI strings must be maintained in **English**.

