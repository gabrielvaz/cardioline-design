"use client";

import * as React from "react";
import { roleById, seedRoles, type Role } from "@/lib/roles";

/**
 * The signed-in user's working context: which role preset they picked during
 * the first-login setup, and the interface preferences that setup collected.
 *
 * Authentication is still mocked, so this is deliberately a browser-local
 * record rather than a session token. It exists so the rest of the app has one
 * place to ask "who is using this, and how do they want it to look" —
 * navigation, home routing and permissions all read from here.
 */

export type Density = "compact" | "comfortable";

export const densities: {
  id: Density;
  label: string;
  description: string;
  detail: string[];
}[] = [
  {
    id: "compact",
    label: "Compact",
    description: "More information at once",
    detail: ["Shorter rows", "Denser tables", "Less vertical spacing"],
  },
  {
    id: "comfortable",
    label: "Comfortable",
    description: "More room to read",
    detail: ["Taller rows", "Roomier cards", "Easier to scan"],
  },
];

export type SessionState = {
  roleId: string;
  density: Density;
  setupComplete: boolean;
};

const STORAGE_KEY = "vireo-ark-session";

const defaultState: SessionState = {
  roleId: "cardiologist",
  density: "comfortable",
  setupComplete: false,
};

type SessionContextValue = {
  /** False until localStorage has been read; guards against rendering a
   *  role-dependent layout with default data on the server pass. */
  hydrated: boolean;
  state: SessionState;
  role: Role;
  setRole: (roleId: string) => void;
  setDensity: (density: Density) => void;
  completeSetup: (choices: { roleId: string; density: Density }) => void;
  /** Sends the user back through the first-login setup. */
  resetSetup: () => void;
};

const SessionContext = React.createContext<SessionContextValue | null>(null);

function read(): SessionState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SessionState>;
    if (typeof parsed.roleId !== "string" || !roleById(parsed.roleId)) return null;
    return {
      roleId: parsed.roleId,
      density: parsed.density === "compact" ? "compact" : "comfortable",
      setupComplete: parsed.setupComplete === true,
    };
  } catch {
    return null;
  }
}

/** Density is a document-level concern — one attribute drives the token
 *  overrides in globals.css rather than a class on every table. */
function applyDensity(density: Density) {
  document.documentElement.dataset.density = density;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false);
  const [state, setState] = React.useState<SessionState>(defaultState);

  React.useEffect(() => {
    const stored = read();
    if (stored) setState(stored);
    applyDensity(stored?.density ?? defaultState.density);
    setHydrated(true);
  }, []);

  const persist = React.useCallback((next: SessionState) => {
    setState(next);
    applyDensity(next.density);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* Private browsing: the choice still applies for this session. */
    }
  }, []);

  const value = React.useMemo<SessionContextValue>(() => {
    const role = roleById(state.roleId) ?? seedRoles[0];
    return {
      hydrated,
      state,
      role,
      setRole: (roleId) => persist({ ...state, roleId }),
      setDensity: (density) => persist({ ...state, density }),
      completeSetup: ({ roleId, density }) =>
        persist({ roleId, density, setupComplete: true }),
      resetSetup: () => persist({ ...state, setupComplete: false }),
    };
  }, [hydrated, persist, state]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = React.useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside SessionProvider");
  return context;
}
