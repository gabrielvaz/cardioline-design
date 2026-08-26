"use client";

import * as React from "react";
import { Lock, Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  ConfirmDialog,
  Input,
} from "@cardioline/ui";
import { PrototypeToast } from "@/components/ui/prototype-toast";
import { RoleEditorModal } from "@/components/settings/role-editor-modal";
import {
  countGranted,
  dataScopes,
  emptyRole,
  moduleById,
  seedRoles,
  type Role,
} from "@/lib/roles";

/**
 * Roles administration. Unlike the other admin resources, a role is not a
 * name plus a note — it is a permission document, so the list previews what
 * each profile can actually do and the editor owns the detail.
 */
export function RolesAdminPage() {
  const [roles, setRoles] = React.useState<Role[]>(seedRoles);
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<Role | null>(null);
  const [deleting, setDeleting] = React.useState<Role | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);

  const list = roles.filter((role) =>
    `${role.name} ${role.description} ${role.vertical}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const save = (role: Role) => {
    setRoles((current) =>
      current.some((item) => item.id === role.id)
        ? current.map((item) => (item.id === role.id ? role : item))
        : [role, ...current],
    );
    setEditing(null);
    setToast(`${role.name} saved in this prototype.`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border p-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles..."
            className="bg-muted pl-9"
          />
        </div>
        <Button onClick={() => setEditing(emptyRole(`role-${roles.length + 1}`))}>
          <Plus />
          Add Role
        </Button>
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {/* Beat forces `table-layout: fixed` on clinical tables, so column
              widths are declared rather than inferred. The min-width has to
              stay under the settings content column (~1088px at 1700px
              viewport) or Actions falls off the right edge into the scroll. */}
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              {/* Fixed pixel widths on the satellite columns; Role carries no
                  width so it absorbs whatever is left and its description gets
                  the room. Percentages resolved unevenly against the table's
                  min-width and squeezed Actions to nothing. */}
              <tr>
                <th className="px-5 py-4">Role</th>
                <th className="w-[140px] px-5 py-4">Initial page</th>
                <th className="w-[150px] px-5 py-4">Data scope</th>
                <th className="w-[140px] px-5 py-4">Grants</th>
                <th className="w-[110px] px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((role) => {
                const granted = countGranted(role);
                return (
                  <tr key={role.id} className="transition-colors hover:bg-muted/70">
                    {/* `!` is required: Beat's `.overflow-x-auto > table td`
                        rule outranks a plain utility on specificity, and it
                        sets nowrap + ellipsis, which was clipping the text. */}
                    <td className="!whitespace-normal px-5 py-4 align-top">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        {role.name}
                        {role.builtIn && (
                          <Lock
                            className="h-3 w-3 text-muted-foreground"
                            aria-label="Built-in role"
                          />
                        )}
                      </span>
                      {/* `whitespace-normal` on the cell overrides Beat's
                          nowrap-and-ellipsis rule, which was clipping this. */}
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                        {role.description}
                      </span>
                      <span className="mt-1 inline-block text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
                        {role.vertical}
                      </span>
                    </td>
                    <td className="!whitespace-normal px-5 py-4 align-top text-muted-foreground">
                      {moduleById(role.landing).label}
                    </td>
                    <td className="!whitespace-normal px-5 py-4 align-top text-muted-foreground">
                      {dataScopes.find((scope) => scope.id === role.scope)?.label}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="neutral">{granted.modules} modules</Badge>
                        <Badge variant="default">{granted.capabilities} features</Badge>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right align-top">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Edit ${role.name}`}
                          onClick={() => setEditing(role)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Remove ${role.name}`}
                          disabled={role.builtIn}
                          title={
                            role.builtIn
                              ? "Built-in roles cannot be deleted"
                              : undefined
                          }
                          onClick={() => setDeleting(role)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>

      <RoleEditorModal
        open={Boolean(editing)}
        role={editing}
        onCancel={() => setEditing(null)}
        onSave={save}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete role"
        description={`Users assigned to ${deleting?.name ?? "this role"} lose every permission it granted and will not be able to work until another role is assigned.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          setRoles((current) => current.filter((role) => role.id !== deleting?.id));
          setToast(`${deleting?.name} removed from this prototype.`);
          setDeleting(null);
        }}
      />
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </Card>
  );
}
