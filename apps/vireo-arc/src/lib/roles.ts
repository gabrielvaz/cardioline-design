/**
 * Role and permission model for Vireo ARK — the single source for what a user
 * can reach, what they can do, and where they land.
 *
 *     onboarding selection → role preset → permissions → navigation → home → actions
 *
 * The shape and the seeded profiles come from `Cardioline WebApp 3.0.pdf`
 * (`02-cardioline/2026-08-26-vireo-ark-specs/`): the verticals it serves
 * (slides 7-8), the actors named in the Hospital and Private Cardiologist
 * models (slides 34-35), and the 3.0 capabilities each profile must reach or
 * not — role management with "fully customizable profile management", SLA
 * customization, report customization per site/exam type, externalized legal
 * digital signature, video-chat in the reporting environment, AI reporting
 * tools and API/interoperability support (slides 15-16, 35).
 *
 * Four of these roles carry a `preset`: they are the personas the first-login
 * setup offers. A preset is a starting point, not a lock — administrators edit
 * any of it in Settings → Administration → Roles.
 */

import {
  Activity,
  BriefcaseMedical,
  Radio,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

/* ─── Module access ──────────────────────────────────────────────── */

/** Read-write is a step above read-only, so a role can be widened or narrowed
 *  on one axis without being rebuilt. */
export type AccessLevel = "none" | "view" | "edit";

export const accessLevels: {
  id: AccessLevel;
  label: string;
  description: string;
}[] = [
  { id: "none", label: "No access", description: "Hidden from the navigation" },
  { id: "view", label: "View", description: "Can open and read, cannot change" },
  { id: "edit", label: "Edit", description: "Can create, change and delete" },
];

export type ModuleId =
  | "dashboard"
  | "capture"
  | "examInbox"
  | "operations"
  | "exams"
  | "patients"
  | "reports"
  | "administration"
  | "systemConfig";

export const modules: {
  id: ModuleId;
  label: string;
  href: string;
  description: string;
  /** Modules where read-write is meaningless — there is nothing to author. */
  viewOnly?: boolean;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    description: "Department volume, SLA and activity overview",
    viewOnly: true,
  },
  {
    id: "capture",
    label: "Capture & Send",
    href: "/capture",
    description: "Acquisition queue, transmission status and sync",
  },
  {
    id: "examInbox",
    label: "Exam Inbox",
    href: "/exam-inbox",
    description: "Personal worklist ranked by clinical priority",
  },
  {
    id: "operations",
    label: "Operations",
    href: "/operations",
    description: "SLA, throughput, bottlenecks and team performance",
    viewOnly: true,
  },
  {
    id: "exams",
    label: "Exams and ECG",
    href: "/exams",
    description: "Exam archive, ECG viewer and measurements",
  },
  {
    id: "patients",
    label: "Patients",
    href: "/patients",
    description: "Patient demographics and clinical history",
  },
  {
    id: "reports",
    label: "Reports",
    href: "/reports",
    description: "Diagnostic reports, export and distribution",
  },
  {
    id: "administration",
    label: "Administration",
    href: "/settings/admin/users",
    description: "Users, roles, sites, groups and devices",
  },
  {
    id: "systemConfig",
    label: "System configuration",
    href: "/settings/system",
    description: "Integrations, security policy and system settings",
  },
];

/* ─── Capabilities ───────────────────────────────────────────────── */

export type CapabilityId =
  /* core */
  | "viewPatientRecord"
  | "exportShare"
  | "videoConsult"
  /* capture */
  | "acquireExam"
  | "sendExam"
  | "retrySend"
  | "syncQueue"
  /* exam inbox */
  | "triageInbox"
  | "assignExam"
  /* clinical modules */
  | "viewEcg"
  | "viewAbpm"
  | "viewHolter"
  | "viewStress"
  | "viewMultiModality"
  /* reporting */
  | "createReport"
  | "signReport"
  | "requestOverread"
  | "performOverread"
  /* ai */
  | "mindBeat"
  | "mindBridge"
  /* management */
  | "opsDashboard"
  | "manageUsers"
  | "manageSla"
  | "managePriorityCriteria"
  | "viewClinicalContent"
  /* configuration */
  | "reportTemplates"
  | "apiAccess"
  | "viewAudit";

export type CapabilityGroup =
  | "core"
  | "capture"
  | "examInbox"
  | "clinicalModules"
  | "reporting"
  | "ai"
  | "management"
  | "configuration";

export const capabilityGroups: {
  id: CapabilityGroup;
  label: string;
  description: string;
}[] = [
  { id: "core", label: "Core", description: "Baseline access every profile builds on" },
  { id: "capture", label: "Capture", description: "Acquiring exams and getting them to the archive" },
  { id: "examInbox", label: "Exam Inbox", description: "Working the prioritized worklist" },
  { id: "clinicalModules", label: "Clinical modules", description: "Diagnostic viewers per modality" },
  { id: "reporting", label: "Reporting", description: "Producing and signing the diagnostic report" },
  { id: "ai", label: "AI support", description: "Assistive analysis alongside the tracing" },
  { id: "management", label: "Management", description: "Running the operation and the people in it" },
  { id: "configuration", label: "Configuration", description: "System-level settings and integration" },
];

export const capabilities: {
  id: CapabilityId;
  group: CapabilityGroup;
  label: string;
  description: string;
  /** Grants that change the clinical or security record of the organization.
   *  The editor calls these out when they are switched on. */
  sensitive?: boolean;
}[] = [
  /* core */
  { id: "viewPatientRecord", group: "core", label: "Patient record", description: "Open demographics and clinical history" },
  { id: "exportShare", group: "core", label: "Export and share", description: "Export PDF and push results to third-party systems" },
  { id: "videoConsult", group: "core", label: "Video consultation", description: "Integrated video-chat inside the reporting environment" },

  /* capture */
  { id: "acquireExam", group: "capture", label: "Acquire exams", description: "Start acquisition on a device and attach it to a patient" },
  { id: "sendExam", group: "capture", label: "Send to archive", description: "Transmit a finished acquisition through the Archiver" },
  { id: "retrySend", group: "capture", label: "Retry failed sends", description: "Re-queue a transmission that did not complete" },
  { id: "syncQueue", group: "capture", label: "Offline sync queue", description: "Hold exams locally and sync when connectivity returns" },

  /* exam inbox */
  { id: "triageInbox", group: "examInbox", label: "Work the inbox", description: "Open, rank and act on the prioritized worklist" },
  { id: "assignExam", group: "examInbox", label: "Assign exams", description: "Route an exam to another reader" },

  /* clinical modules */
  { id: "viewEcg", group: "clinicalModules", label: "Resting ECG", description: "Diagnostic ECG viewer and measurements", sensitive: true },
  { id: "viewAbpm", group: "clinicalModules", label: "ABPM", description: "Ambulatory blood pressure viewer", sensitive: true },
  { id: "viewHolter", group: "clinicalModules", label: "Holter", description: "Holter analysis and beat classification", sensitive: true },
  { id: "viewStress", group: "clinicalModules", label: "Stress test", description: "Exercise ECG review", sensitive: true },
  { id: "viewMultiModality", group: "clinicalModules", label: "Multi-modality viewer", description: "Compare modalities side by side" },

  /* reporting */
  { id: "createReport", group: "reporting", label: "Write reports", description: "Author and edit the diagnostic impression", sensitive: true },
  { id: "signReport", group: "reporting", label: "Sign reports", description: "Apply the legal digital signature and finalize", sensitive: true },
  { id: "requestOverread", group: "reporting", label: "Request overreading", description: "Send an exam to an external overreading service" },
  { id: "performOverread", group: "reporting", label: "Perform overreading", description: "Read and counter-sign exams routed from other organizations", sensitive: true },

  /* ai */
  { id: "mindBeat", group: "ai", label: "MindBeat", description: "AI-assisted interpretation alongside the tracing" },
  { id: "mindBridge", group: "ai", label: "MindBridge", description: "Vendor-agnostic AI integration panel" },

  /* management */
  { id: "opsDashboard", group: "management", label: "Operations dashboard", description: "Aggregated volume, SLA and team performance" },
  { id: "manageUsers", group: "management", label: "Manage users and roles", description: "Create accounts and assign permission profiles", sensitive: true },
  { id: "manageSla", group: "management", label: "SLA configuration", description: "Define turnaround targets and escalation rules" },
  { id: "managePriorityCriteria", group: "management", label: "Priority criteria", description: "Tune how the inbox ranks clinical urgency" },
  {
    id: "viewClinicalContent",
    group: "management",
    label: "Identified clinical content",
    /* Off by default for management profiles: whether an operational manager
       may open an individual patient's clinical data is an unsettled
       compliance/LGPD question, so it is a deliberate switch, never implied. */
    description: "Open individual patient clinical data, not just aggregates — unresolved compliance question, off by default",
    sensitive: true,
  },

  /* configuration */
  { id: "reportTemplates", group: "configuration", label: "Report templates", description: "Customize report layout per site and exam type" },
  { id: "apiAccess", group: "configuration", label: "API and interoperability", description: "Issue API credentials and configure HIS/EMR integration", sensitive: true },
  { id: "viewAudit", group: "configuration", label: "Audit trail", description: "Read the security and access log" },
];

/* ─── Data scope ─────────────────────────────────────────────────── */

export type DataScope = "own" | "assigned" | "site" | "group" | "all";

export const dataScopes: { id: DataScope; label: string; description: string }[] = [
  { id: "own", label: "Own records", description: "Only what this user created or is responsible for" },
  { id: "assigned", label: "Assigned only", description: "Only exams explicitly routed to this user" },
  { id: "site", label: "Own site", description: "Every record of the site the user belongs to" },
  { id: "group", label: "Own group", description: "Every site inside the user's group" },
  { id: "all", label: "Whole organization", description: "Every record across all sites and groups" },
];

/* ─── Preset persona ─────────────────────────────────────────────── */

/** What the first-login setup shows for a role, and what its home emphasizes.
 *  Only roles carrying this appear as choices during onboarding. */
export type PersonaPreset = {
  icon: LucideIcon;
  /** What this profile calls its home. The same module reads differently per
   *  role — a Technician's "Capture & Send" is a field operator's
   *  "Capture & Sync" — and the navigation and the page must agree. */
  homeLabel: string;
  /** One line, second person — read during setup. */
  tagline: string;
  /** The promise the setup makes about the resulting workspace. */
  promise: string;
  /** What the home surfaces first, in priority order. */
  priorities: string[];
  /** The primary actions this profile reaches for. */
  actions: string[];
  /** Order the personas appear in the setup. */
  order: number;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  /** The vertical from the spec this profile was drawn from. */
  vertical: string;
  landing: ModuleId;
  scope: DataScope;
  access: Record<ModuleId, AccessLevel>;
  capabilities: CapabilityId[];
  /** Built-in profiles ship with the product. They stay editable, but the
   *  editor warns that changes reach everyone already assigned. */
  builtIn: boolean;
  /** Present on the four profiles offered by the first-login setup. */
  preset?: PersonaPreset;
};

const noAccess: Record<ModuleId, AccessLevel> = {
  dashboard: "none",
  capture: "none",
  examInbox: "none",
  operations: "none",
  exams: "none",
  patients: "none",
  reports: "none",
  administration: "none",
  systemConfig: "none",
};

const access = (overrides: Partial<Record<ModuleId, AccessLevel>>) => ({
  ...noAccess,
  ...overrides,
});

export const seedRoles: Role[] = [
  {
    id: "ecg-technician",
    name: "Technician",
    description:
      "Operates the devices and captures exams. Prepares the study for a reader and never interprets or signs it.",
    vertical: "Hospital · Primary Care · Emergency",
    landing: "capture",
    scope: "site",
    access: access({
      capture: "edit",
      exams: "view",
      patients: "edit",
    }),
    capabilities: [
      "viewPatientRecord",
      "acquireExam",
      "sendExam",
      "retrySend",
      "requestOverread",
    ],
    builtIn: true,
    preset: {
      icon: Activity,
      order: 1,
      homeLabel: "Capture & Send",
      tagline: "You capture and send exams for someone else to read.",
      promise:
        "Your workspace will prioritize capturing, sending and tracking exams.",
      priorities: [
        "Exams waiting to be captured",
        "Exams waiting to be sent",
        "Transmission status",
        "Capture quality alerts",
      ],
      actions: ["New Exam", "Capture Exam", "Send Exam", "Retry Send"],
    },
  },
  {
    id: "point-of-care-operator",
    name: "Point of Care Operator",
    description:
      "Captures exams away from the hospital — ambulance, home care, mobile unit — where connectivity comes and goes.",
    vertical: "Point of Care",
    landing: "capture",
    scope: "own",
    access: access({
      capture: "edit",
      patients: "edit",
    }),
    capabilities: [
      "viewPatientRecord",
      "acquireExam",
      "sendExam",
      "retrySend",
      "syncQueue",
    ],
    builtIn: true,
    preset: {
      icon: Radio,
      order: 2,
      homeLabel: "Capture & Sync",
      tagline: "You capture exams in the field, often offline.",
      promise:
        "Your workspace will prioritize fast capture and reliable synchronization wherever you work.",
      priorities: [
        "New capture",
        "Pending exams",
        "Connection state",
        "Exams waiting to upload",
      ],
      actions: ["New Exam", "Capture", "Sync", "Retry"],
    },
  },
  {
    id: "cardiologist",
    name: "Reviewing Physician",
    description:
      "Interprets exams and produces the report. The core reading profile — clinical modules, AI support and the signature.",
    vertical: "Hospital · Overreading · Private practice",
    landing: "examInbox",
    scope: "site",
    access: access({
      dashboard: "view",
      examInbox: "edit",
      exams: "edit",
      patients: "edit",
      reports: "edit",
    }),
    capabilities: [
      "viewPatientRecord",
      "exportShare",
      "videoConsult",
      "triageInbox",
      "assignExam",
      "viewEcg",
      "viewAbpm",
      "viewHolter",
      "viewStress",
      "viewMultiModality",
      "createReport",
      "signReport",
      "requestOverread",
      "mindBeat",
      "mindBridge",
    ],
    builtIn: true,
    preset: {
      icon: Stethoscope,
      order: 3,
      homeLabel: "Exam Inbox",
      tagline: "You read exams and sign the report.",
      promise:
        "Your workspace will prioritize the exams that need your attention and make reporting faster.",
      priorities: [
        "Urgent exams",
        "Pacemaker and relevant ECG changes",
        "Pediatric patients",
        "Longest waiting",
      ],
      actions: ["Open Exam", "Review", "Start Report", "Sign Report"],
    },
  },
  {
    id: "department-manager",
    name: "Department Manager",
    description:
      "Runs the operation: turnaround, staffing and quality. Administers people and rules, not diagnoses.",
    vertical: "Hospital · Analysis centre · Clinic network",
    landing: "operations",
    scope: "group",
    access: access({
      dashboard: "view",
      operations: "view",
      exams: "view",
      reports: "view",
      administration: "edit",
    }),
    capabilities: [
      "exportShare",
      "opsDashboard",
      "manageUsers",
      "manageSla",
      "managePriorityCriteria",
      "reportTemplates",
      "viewAudit",
      /* `viewClinicalContent` is deliberately absent — see its description. */
    ],
    builtIn: true,
    preset: {
      icon: BriefcaseMedical,
      order: 4,
      homeLabel: "Operations",
      tagline: "You run the operation and answer for its numbers.",
      promise:
        "Your workspace will prioritize operational visibility, team performance and SLA.",
      priorities: [
        "Exams completed and pending",
        "SLA and breaches",
        "Bottlenecks and volume",
        "Team performance",
      ],
      actions: ["View Operations", "Manage Users", "Configure SLA", "Configure Roles"],
    },
  },
  {
    id: "system-administrator",
    name: "System Administrator",
    description:
      "IT owner of the deployment. Runs accounts, integrations and security policy, and deliberately holds no clinical signing rights.",
    vertical: "Hospital · IT team",
    landing: "administration",
    scope: "all",
    access: access({
      dashboard: "view",
      operations: "view",
      exams: "view",
      patients: "view",
      reports: "view",
      administration: "edit",
      systemConfig: "edit",
    }),
    capabilities: [
      "manageUsers",
      "apiAccess",
      "viewAudit",
      "manageSla",
      "reportTemplates",
      "exportShare",
    ],
    builtIn: true,
  },
  {
    id: "private-cardiologist",
    name: "Private Cardiologist",
    description:
      "Solo or small-practice cardiologist running the whole journey alone: acquires, interprets, signs and administers their own practice.",
    vertical: "Private Cardiologists",
    landing: "examInbox",
    scope: "own",
    access: access({
      dashboard: "view",
      capture: "edit",
      examInbox: "edit",
      exams: "edit",
      patients: "edit",
      reports: "edit",
      administration: "view",
    }),
    capabilities: [
      "viewPatientRecord",
      "exportShare",
      "videoConsult",
      "acquireExam",
      "sendExam",
      "triageInbox",
      "viewEcg",
      "viewAbpm",
      "viewHolter",
      "viewStress",
      "createReport",
      "signReport",
      "requestOverread",
      "mindBeat",
      "reportTemplates",
    ],
    builtIn: true,
  },
  {
    id: "overreading-physician",
    name: "Overreading Physician",
    description:
      "External reader working through routed volume. Sees only what is assigned, never the host organization's administration.",
    vertical: "Overreading Services",
    landing: "examInbox",
    scope: "assigned",
    access: access({
      examInbox: "edit",
      exams: "edit",
      patients: "view",
      reports: "edit",
    }),
    capabilities: [
      "viewPatientRecord",
      "videoConsult",
      "triageInbox",
      "viewEcg",
      "viewAbpm",
      "viewHolter",
      "viewStress",
      "createReport",
      "signReport",
      "performOverread",
      "mindBeat",
    ],
    builtIn: true,
  },
  {
    id: "referring-physician",
    name: "Referring Physician",
    description:
      "Requesting clinician outside cardiology — including emergency medicine. Follows their own patients' results read-only.",
    vertical: "Emergency Medicine · Primary Care",
    landing: "reports",
    scope: "own",
    access: access({
      exams: "view",
      patients: "view",
      reports: "view",
    }),
    capabilities: ["viewPatientRecord", "videoConsult", "exportShare"],
    builtIn: true,
  },
];

/* ─── Helpers ────────────────────────────────────────────────────── */

export const moduleById = (id: ModuleId) =>
  modules.find((m) => m.id === id) ?? modules[0];

export const roleById = (id: string) => seedRoles.find((role) => role.id === id);

/** The four profiles the first-login setup offers, in presentation order. */
export const personaRoles = seedRoles
  .filter((role): role is Role & { preset: PersonaPreset } => Boolean(role.preset))
  .sort((a, b) => a.preset.order - b.preset.order);

/** Landing options are derived, not fixed: a role can only start on a module
 *  it is actually allowed to open. */
export function landingOptions(access: Record<ModuleId, AccessLevel>) {
  return modules.filter((m) => access[m.id] !== "none");
}

/** The route a role lands on after sign-in. */
export const homeHref = (role: Role) => moduleById(role.landing).href;

/** What a module is called *for this role* — presets rename their own home. */
export const moduleLabel = (role: Role, id: ModuleId) =>
  id === role.landing && role.preset ? role.preset.homeLabel : moduleById(id).label;

/** Navigation for a role: every module it can open, in the declared order. */
export const navigationFor = (role: Role) =>
  modules.filter((m) => role.access[m.id] !== "none");

export const can = (role: Role, capability: CapabilityId) =>
  role.capabilities.includes(capability);

export const canOpen = (role: Role, module: ModuleId) =>
  role.access[module] !== "none";

export const canEdit = (role: Role, module: ModuleId) =>
  role.access[module] === "edit";

export function countGranted(role: Pick<Role, "access" | "capabilities">) {
  const reachable = modules.filter((m) => role.access[m.id] !== "none").length;
  return { modules: reachable, capabilities: role.capabilities.length };
}

export function emptyRole(id: string): Role {
  return {
    id,
    name: "",
    description: "",
    vertical: "Custom",
    landing: "dashboard",
    scope: "own",
    access: { ...noAccess, dashboard: "view" },
    capabilities: [],
    builtIn: false,
  };
}
