"use client";

import * as React from "react";
import { AlertTriangle, Lock } from "lucide-react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@cardioline/ui";
import {
  accessLevels,
  capabilities,
  capabilityGroups,
  dataScopes,
  landingOptions,
  modules,
  type AccessLevel,
  type CapabilityId,
  type DataScope,
  type ModuleId,
  type Role,
} from "@/lib/roles";

/**
 * Full permission editor for a role. A role decides what an entire class of
 * clinicians can reach, so the dialog states the consequence of each choice
 * next to the control instead of leaving it to a manual.
 */
export function RoleEditorModal({
  open,
  role,
  onCancel,
  onSave,
}: {
  open: boolean;
  role: Role | null;
  onCancel: () => void;
  onSave: (role: Role) => void;
}) {
  const [draft, setDraft] = React.useState<Role | null>(role);

  React.useEffect(() => {
    if (open) setDraft(role);
  }, [open, role]);

  if (!draft) return null;

  const setAccess = (id: ModuleId, level: AccessLevel) =>
    setDraft((current) => {
      if (!current) return current;
      const access = { ...current.access, [id]: level };
      /* A landing page the role can no longer open would strand the user on a
         blank screen at sign-in, so it falls back to the first module left. */
      const landing = access[current.landing] === "none"
        ? (landingOptions(access)[0]?.id ?? "dashboard")
        : current.landing;
      return { ...current, access, landing };
    });

  const toggleCapability = (id: CapabilityId) =>
    setDraft((current) =>
      current
        ? {
            ...current,
            capabilities: current.capabilities.includes(id)
              ? current.capabilities.filter((item) => item !== id)
              : [...current.capabilities, id],
          }
        : current,
    );

  const landing = landingOptions(draft.access);
  const noModules = landing.length === 0;
  const grantedSensitive = capabilities.filter(
    (capability) => capability.sensitive && draft.capabilities.includes(capability.id),
  );
  /* Signing a report without being able to open one is a dead permission —
     worth surfacing, because it looks granted but does nothing. */
  const signsWithoutReports =
    draft.capabilities.includes("signReport") && draft.access.reports === "none";

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      {/* Twice the previous 3xl. The permission matrix and the feature grid
          both read better across the full width than stacked in a column. */}
      <DialogContent className="max-h-[88vh] max-w-[96rem] overflow-y-auto">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.name.trim()) onSave({ ...draft, name: draft.name.trim() });
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {draft.name || "New role"}
              {draft.builtIn && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium normal-case tracking-normal text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Built-in
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              {draft.builtIn
                ? "Every user already assigned to this role picks up these changes on their next sign-in."
                : "Define what this profile can reach and what it is allowed to do."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-8">
            {/* ── Identity ── */}
            <section className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role name</Label>
                <Input
                  id="role-name"
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((c) => (c ? { ...c, name: event.target.value } : c))
                  }
                  required
                  placeholder="e.g. Holter Analyst"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-vertical">Vertical</Label>
                <Input
                  id="role-vertical"
                  value={draft.vertical}
                  onChange={(event) =>
                    setDraft((c) => (c ? { ...c, vertical: event.target.value } : c))
                  }
                  placeholder="e.g. Point of Care"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="role-description">What this profile is for</Label>
                <Input
                  id="role-description"
                  value={draft.description}
                  onChange={(event) =>
                    setDraft((c) => (c ? { ...c, description: event.target.value } : c))
                  }
                  placeholder="One sentence an administrator can act on"
                />
              </div>
            </section>

            {/* ── Module access ── */}
            <section>
              <SectionHeading
                title="Module access"
                hint="What appears in the navigation, and whether it is read-only."
              />
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Module</th>
                      <th className="px-4 py-3 text-right">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {modules.map((module) => (
                      <tr key={module.id}>
                        <td className="px-4 py-3">
                          <span className="block font-medium text-foreground">
                            {module.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {module.description}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            {accessLevels
                              .filter((level) => !(module.viewOnly && level.id === "edit"))
                              .map((level) => {
                                const active = draft.access[module.id] === level.id;
                                return (
                                  <button
                                    key={level.id}
                                    type="button"
                                    title={level.description}
                                    onClick={() => setAccess(module.id, level.id)}
                                    className={cn(
                                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                                      active
                                        ? "border-primary/40 bg-primary/10 text-primary"
                                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-primary/10",
                                    )}
                                  >
                                    {level.label}
                                  </button>
                                );
                              })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── Landing page and scope ── */}
            <section className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role-landing">Initial page</Label>
                <Select
                  value={draft.landing}
                  onValueChange={(value) =>
                    setDraft((c) => (c ? { ...c, landing: value as ModuleId } : c))
                  }
                  disabled={noModules}
                >
                  <SelectTrigger id="role-landing">
                    <SelectValue placeholder="No module available" />
                  </SelectTrigger>
                  <SelectContent>
                    {landing.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Where the user arrives after signing in. Only modules this role
                  can open are listed.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-scope">Data scope</Label>
                <Select
                  value={draft.scope}
                  onValueChange={(value) =>
                    setDraft((c) => (c ? { ...c, scope: value as DataScope } : c))
                  }
                >
                  <SelectTrigger id="role-scope">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataScopes.map((scope) => (
                      <SelectItem key={scope.id} value={scope.id}>
                        {scope.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {dataScopes.find((scope) => scope.id === draft.scope)?.description}
                </p>
              </div>
            </section>

            {/* ── Capabilities ── */}
            <section>
              <SectionHeading
                title="Features"
                hint="Switched on for this profile wherever they appear in the product."
              />
              <div className="mt-3 space-y-5">
                {capabilityGroups.map((group) => (
                  <div key={group.id}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group.label}
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {capabilities
                        .filter((capability) => capability.group === group.id)
                        .map((capability) => (
                          <label
                            key={capability.id}
                            className="flex cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-3 transition-colors hover:bg-muted"
                          >
                            <Checkbox
                              checked={draft.capabilities.includes(capability.id)}
                              onCheckedChange={() => toggleCapability(capability.id)}
                            />
                            <span>
                              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                {capability.label}
                                {capability.sensitive && (
                                  <AlertTriangle className="h-3 w-3 text-amber-600" />
                                )}
                              </span>
                              <span className="mt-0.5 block text-xs text-muted-foreground">
                                {capability.description}
                              </span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Consequences ── */}
            {(noModules || signsWithoutReports || grantedSensitive.length > 0) && (
              <section className="space-y-2">
                {noModules && (
                  <Notice tone="error">
                    This role cannot open a single module. Anyone assigned to it
                    signs in to an empty application.
                  </Notice>
                )}
                {signsWithoutReports && (
                  <Notice tone="warning">
                    <strong>Sign reports</strong> is granted but Reports is set to
                    no access, so the permission can never be exercised.
                  </Notice>
                )}
                {grantedSensitive.length > 0 && (
                  <Notice tone="warning">
                    Grants that change the clinical or security record:{" "}
                    <strong>
                      {grantedSensitive.map((capability) => capability.label).join(", ")}
                    </strong>
                    .
                  </Notice>
                )}
              </section>
            )}
          </div>

          <DialogFooter className="mt-8">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SectionHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Notice({
  tone,
  children,
}: {
  tone: "warning" | "error";
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-md px-3 py-2 text-xs",
        tone === "error"
          ? "bg-destructive/10 text-destructive"
          : "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
      )}
    >
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
