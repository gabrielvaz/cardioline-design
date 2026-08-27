"use client";

import * as React from "react";

/**
 * The sign-in account picker.
 *
 * One demo account per persona, so the login screen doubles as the fastest way
 * to try the product as each profile. Each entry names a role from `roles.ts`
 * — picking an account seeds the setup with that role rather than defining a
 * separate identity model.
 *
 * Authentication is still mocked: any password is accepted. The field is there
 * because the interaction is part of what we are validating.
 */

export type Profile = {
  id: string;
  name: string;
  title: string;
  roleId: string;
  initials: string;
  /** Tailwind classes for the avatar, kept on the record so a deleted and
   *  restored list stays visually stable. */
  tone: string;
};

export const seedProfiles: Profile[] = [
  {
    id: "p-jenkins",
    name: "Dr. Sarah Jenkins",
    title: "Senior Cardiologist",
    roleId: "cardiologist",
    initials: "SJ",
    tone: "bg-accent text-accent-foreground",
  },
  {
    id: "p-almeida",
    name: "Carlos Almeida",
    title: "ECG Technician · Room 302",
    roleId: "ecg-technician",
    initials: "CA",
    tone: "bg-primary text-primary-foreground",
  },
  {
    id: "p-mancini",
    name: "Chiara Mancini",
    title: "Pharmacist · Farmacia Centrale",
    roleId: "point-of-care-operator",
    initials: "CM",
    tone: "bg-emerald-600 text-white",
  },
  {
    id: "p-bigazzi",
    name: "Andrea Bigazzi",
    title: "Head of Cardiology",
    roleId: "department-manager",
    initials: "AB",
    tone: "bg-violet-600 text-white",
  },
];

const STORAGE_KEY = "vireo-ark-profiles";

/** Ids the user removed from the picker. Storing the removals rather than the
 *  list keeps new demo accounts appearing when the seed grows. */
function readRemoved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function useProfiles() {
  const [removed, setRemoved] = React.useState<string[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setRemoved(readRemoved());
    setHydrated(true);
  }, []);

  const persist = React.useCallback((next: string[]) => {
    setRemoved(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* Private browsing: the removal still applies to this session. */
    }
  }, []);

  return {
    hydrated,
    profiles: seedProfiles.filter((profile) => !removed.includes(profile.id)),
    remove: (id: string) => persist([...removed, id]),
    restore: () => persist([]),
  };
}
