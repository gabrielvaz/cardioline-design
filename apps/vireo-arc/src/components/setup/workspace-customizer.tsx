"use client";

import * as React from "react";
import { Home } from "lucide-react";
import { Switch, cn } from "@cardioline/ui";
import { landingOptions, moduleLabel, type ModuleId, type Role } from "@/lib/roles";

/**
 * Lets a user tune the workspace their role gives them: where they land, and
 * which of their modules stay in the navigation.
 *
 * Every option here is bounded by `role.access` — the list is built from what
 * the role already grants, so a user can narrow their own workspace but never
 * widen it. Granting access remains an administrator's job in
 * Settings → Administration → Roles.
 *
 * Shared by the first-login setup and the profile page so the two cannot drift.
 */
export function WorkspaceCustomizer({
  role,
  home,
  hidden,
  onHomeChange,
  onHiddenChange,
}: {
  role: Role;
  home: ModuleId;
  hidden: ModuleId[];
  onHomeChange: (id: ModuleId) => void;
  onHiddenChange: (hidden: ModuleId[]) => void;
}) {
  const granted = landingOptions(role.access);

  const toggle = (id: ModuleId) =>
    onHiddenChange(
      hidden.includes(id) ? hidden.filter((item) => item !== id) : [...hidden, id],
    );

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Where you start
        </legend>
        <p className="mt-1 text-sm text-muted-foreground">
          Your role suggests{" "}
          <span className="font-medium text-foreground">
            {moduleLabel(role, role.landing)}
          </span>
          . Pick another if you prefer.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {granted.map((module) => {
            const active = home === module.id;
            return (
              <label
                key={module.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                <input
                  type="radio"
                  name="initial-page"
                  value={module.id}
                  checked={active}
                  onChange={() => onHomeChange(module.id)}
                  className="sr-only"
                />
                {active && <Home aria-hidden="true" className="h-3.5 w-3.5" />}
                {moduleLabel(role, module.id)}
                {module.id === role.landing && !active && (
                  <span className="text-[10px] uppercase tracking-wide opacity-60">
                    default
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          In your navigation
        </legend>
        <p className="mt-1 text-sm text-muted-foreground">
          Hide what you never use. Your role decides what can appear here — an
          administrator grants anything beyond it.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {granted.map((module) => {
            const isHome = module.id === home;
            const shown = isHome || !hidden.includes(module.id);
            /* A settings row, not a giant label: the Switch is itself a
               button, so wrapping the whole row in a label would nest two
               interactive controls. The switch takes its accessible name from
               the module heading beside it. */
            return (
              <div
                key={module.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-sm transition-colors",
                  shown ? "border-border bg-card" : "border-dashed border-border bg-muted/40",
                )}
              >
                <span className="min-w-0">
                  <span
                    id={`module-${module.id}`}
                    className="block truncate font-medium text-foreground"
                  >
                    {moduleLabel(role, module.id)}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {isHome ? "Your initial page" : module.description}
                  </span>
                </span>
                <Switch
                  checked={shown}
                  disabled={isHome}
                  onCheckedChange={() => toggle(module.id)}
                  aria-labelledby={`module-${module.id}`}
                  title={
                    isHome
                      ? "Your initial page always stays in the navigation"
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
