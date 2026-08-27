"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Rows2, Rows3, ShieldCheck } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, cn } from "@cardioline/ui";
import { densities, useSession, type Density } from "@/lib/session";
import { moduleLabel } from "@/lib/roles";
import { WorkspaceCustomizer } from "@/components/setup/workspace-customizer";

/**
 * Post-setup preferences. Appearance and density are the user's own; the role
 * is not — changing it would be self-granting permissions, so it is shown
 * read-only and pointed at an administrator.
 */
export function DensityModeSelector() {
  const { state, setDensity } = useSession();
  const icons: Record<Density, typeof Rows2> = {
    compact: Rows3,
    comfortable: Rows2,
  };
  return (
    <div
      className="rounded-lg border border-border bg-muted/50 p-1"
      role="group"
      aria-label="Interface density"
    >
      {densities.map((option) => {
        const Icon = icons[option.id];
        const active = state.density === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setDensity(option.id)}
            aria-pressed={active}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function WorkspaceRoleCard() {
  const { role, roleLabel, home, state, update, resetSetup } = useSession();
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Workspace</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {roleLabel}
              {roleLabel !== role.name && (
                <span className="text-xs font-normal text-muted-foreground">
                  · {role.name} permissions
                </span>
              )}
            </p>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {role.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="secondary">
                Starts on {moduleLabel(role, home)}
              </Badge>
              <Badge variant="neutral">{role.capabilities.length} features</Badge>
            </div>
          </div>
        </div>

        <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          Your role decides what you can reach, so only an administrator can
          change it, in Settings → Administration → Roles. Everything below
          narrows that workspace; none of it widens it.
        </p>

        {/* The same control the first-login setup uses, so the two cannot
            drift apart. */}
        <div className="border-t border-border pt-5">
          <WorkspaceCustomizer
            role={role}
            home={home}
            hidden={state.hiddenModules ?? []}
            onHomeChange={(id) => update({ homeOverride: id })}
            onHiddenChange={(hiddenModules) => update({ hiddenModules })}
          />
        </div>

        {/* Re-running the setup is a preference, not an escalation: it lands on
            the same four presets and cannot grant anything an administrator
            has not already defined. */}
        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Run the setup again
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Walk back through the first-login questions and rebuild your
              workspace.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              resetSetup();
              router.push("/setup");
            }}
          >
            Restart setup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
