/**
 * Role and permission model for Vireo ARK.
 *
 * The shape and the seeded profiles come from `Cardioline WebApp 3.0.pdf`
 * (`02-cardioline/2026-08-26-vireo-ark-specs/`), which sets out:
 *
 *  - the verticals the product serves — Hospital, Primary Care, Point of Care
 *    (pharmacies, occupational health, nursing home, homecare), Emergency
 *    Medicine, Private Cardiologists and Overreading Services (slides 7-8);
 *  - the actors named in the Hospital and Private Cardiologist models —
 *    cardiologists, physicians and other clinicians, administrators and the IT
 *    team (slides 34-35);
 *  - the 3.0 capabilities each profile has to be able to reach or not: role
 *    management with "fully customizable profile management", SLA
 *    customization, site and group management, report customization per
 *    site/exam type, externalized legal digital signature, status-change
 *    notifications, integrated video-chat in the reporting environment,
 *    AI reporting tools, and extensive API/interoperability support
 *    (slides 15-16, 35).
 *
 * A role answers four questions, and the editor is organized around them:
 *   1. Where does the user land when they sign in?
 *   2. Which modules can they reach, and read-only or read-write?
 *   3. Which capabilities are switched on for them?
 *   4. Whose data do they see?
 */

/* ─── Module access ──────────────────────────────────────────────── */

/** Read-write is deliberately a step above read-only, so a role can be
 *  widened or narrowed on one axis without rebuilding it. */
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
  | "examInbox"
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
    id: "examInbox",
    label: "Exam Inbox",
    href: "/exam-inbox",
    description: "Personal worklist ranked by clinical priority",
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
  | "acquireExam"
  | "interpretExam"
  | "signReport"
  | "requestOverread"
  | "performOverread"
  | "aiAssist"
  | "videoConsult"
  | "exportShare"
  | "manageSla"
  | "reportTemplates"
  | "manageUsers"
  | "apiAccess"
  | "viewAudit";

export type CapabilityGroup = "clinical" | "collaboration" | "administration";

export const capabilityGroups: { id: CapabilityGroup; label: string }[] = [
  { id: "clinical", label: "Clinical workflow" },
  { id: "collaboration", label: "Collaboration and distribution" },
  { id: "administration", label: "Administration" },
];

export const capabilities: {
  id: CapabilityId;
  group: CapabilityGroup;
  label: string;
  description: string;
  /** Capabilities that carry clinical or legal weight get a warning when
   *  granted — a role holding these can change a diagnosis of record. */
  sensitive?: boolean;
}[] = [
  {
    id: "acquireExam",
    group: "clinical",
    label: "Acquire and upload exams",
    description: "Start acquisition on a device and send it to the platform",
  },
  {
    id: "interpretExam",
    group: "clinical",
    label: "Interpret exams",
    description: "Edit measurements and write the diagnostic impression",
    sensitive: true,
  },
  {
    id: "signReport",
    group: "clinical",
    label: "Sign reports",
    description: "Apply the legal digital signature and finalize a report",
    sensitive: true,
  },
  {
    id: "requestOverread",
    group: "clinical",
    label: "Request overreading",
    description: "Send an exam to an external overreading service",
  },
  {
    id: "performOverread",
    group: "clinical",
    label: "Perform overreading",
    description: "Read and counter-sign exams routed from other organizations",
    sensitive: true,
  },
  {
    id: "aiAssist",
    group: "clinical",
    label: "AI reporting tools",
    description: "Vendor-agnostic AI suggestions alongside the tracing",
  },
  {
    id: "videoConsult",
    group: "collaboration",
    label: "Video consultation",
    description: "Integrated video-chat inside the reporting environment",
  },
  {
    id: "exportShare",
    group: "collaboration",
    label: "Export and share",
    description: "Export PDF, share links and push results to third-party systems",
  },
  {
    id: "reportTemplates",
    group: "administration",
    label: "Report templates",
    description: "Customize report layout per site and exam type",
  },
  {
    id: "manageSla",
    group: "administration",
    label: "SLA configuration",
    description: "Define turnaround targets and escalation rules",
  },
  {
    id: "manageUsers",
    group: "administration",
    label: "Manage users and roles",
    description: "Create accounts and assign permission profiles",
    sensitive: true,
  },
  {
    id: "apiAccess",
    group: "administration",
    label: "API and interoperability",
    description: "Issue API credentials and configure HIS/EMR integration",
    sensitive: true,
  },
  {
    id: "viewAudit",
    group: "administration",
    label: "Audit trail",
    description: "Read the security and access log",
  },
];

/* ─── Data scope ─────────────────────────────────────────────────── */

export type DataScope = "own" | "assigned" | "site" | "group" | "all";

export const dataScopes: {
  id: DataScope;
  label: string;
  description: string;
}[] = [
  { id: "own", label: "Own records", description: "Only what this user created or is responsible for" },
  { id: "assigned", label: "Assigned only", description: "Only exams explicitly routed to this user" },
  { id: "site", label: "Own site", description: "Every record of the site the user belongs to" },
  { id: "group", label: "Own group", description: "Every site inside the user's group" },
  { id: "all", label: "Whole organization", description: "Every record across all sites and groups" },
];

/* ─── Role ───────────────────────────────────────────────────────── */

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
  /** Built-in profiles ship with the product; they can be edited but the
   *  editor warns that changes affect everyone already assigned. */
  builtIn: boolean;
};

const noAccess: Record<ModuleId, AccessLevel> = {
  dashboard: "none",
  examInbox: "none",
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

/**
 * The eight profiles the spec's verticals imply. They are starting points, not
 * a closed list — 3.0 sells "fully customizable profile management", so the
 * editor lets an administrator build anything from these.
 */
export const seedRoles: Role[] = [
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
      exams: "view",
      patients: "view",
      reports: "view",
      administration: "edit",
      systemConfig: "edit",
    }),
    capabilities: ["manageUsers", "apiAccess", "viewAudit", "manageSla", "reportTemplates", "exportShare"],
    builtIn: true,
  },
  {
    id: "cardiologist",
    name: "Cardiologist",
    description:
      "Reads, interprets and signs exams for the department. The core reading profile in the hospital model.",
    vertical: "Hospital · Primary Care",
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
      "interpretExam",
      "signReport",
      "requestOverread",
      "aiAssist",
      "videoConsult",
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
      examInbox: "edit",
      exams: "edit",
      patients: "edit",
      reports: "edit",
      administration: "view",
    }),
    capabilities: [
      "acquireExam",
      "interpretExam",
      "signReport",
      "requestOverread",
      "aiAssist",
      "videoConsult",
      "exportShare",
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
    capabilities: ["interpretExam", "signReport", "performOverread", "aiAssist", "videoConsult"],
    builtIn: true,
  },
  {
    id: "department-manager",
    name: "Department Manager",
    description:
      "Runs the cardiac department: turnaround, staffing and report standards. Administers people and rules, not diagnoses.",
    vertical: "Hospital · administration",
    landing: "dashboard",
    scope: "group",
    access: access({
      dashboard: "view",
      examInbox: "view",
      exams: "view",
      patients: "view",
      reports: "view",
      administration: "edit",
    }),
    capabilities: ["manageSla", "reportTemplates", "manageUsers", "viewAudit", "exportShare"],
    builtIn: true,
  },
  {
    id: "ecg-technician",
    name: "ECG Technician",
    description:
      "Acquires exams and keeps the worklist moving. Prepares the study for a reader but never interprets or signs it.",
    vertical: "Hospital · Primary Care",
    landing: "exams",
    scope: "site",
    access: access({
      dashboard: "view",
      examInbox: "view",
      exams: "edit",
      patients: "edit",
      reports: "view",
    }),
    capabilities: ["acquireExam", "requestOverread", "exportShare"],
    builtIn: true,
  },
  {
    id: "point-of-care-operator",
    name: "Point of Care Operator",
    description:
      "Non-clinical operator in a pharmacy, occupational health service, nursing home or homecare visit. Captures and sends, sees nothing else.",
    vertical: "Point of Care",
    landing: "exams",
    scope: "own",
    access: access({
      exams: "edit",
      patients: "edit",
    }),
    capabilities: ["acquireExam", "requestOverread"],
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
    capabilities: ["videoConsult", "exportShare"],
    builtIn: true,
  },
];

/* ─── Helpers ────────────────────────────────────────────────────── */

export const moduleById = (id: ModuleId) => modules.find((m) => m.id === id)!;

/** Landing page options are derived, not fixed: a role can only start on a
 *  module it is actually allowed to open. */
export function landingOptions(access: Record<ModuleId, AccessLevel>) {
  return modules.filter((m) => access[m.id] !== "none");
}

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
