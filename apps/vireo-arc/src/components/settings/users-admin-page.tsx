"use client";

import * as React from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  ConfirmDialog,
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
} from "@cardioline/ui";
import { PrototypeToast } from "@/components/ui/prototype-toast";
import { currentUser } from "@/lib/mock-data";
import { countGranted, dataScopes, moduleById, seedRoles, type Role } from "@/lib/roles";

type User = { id: string; name: string; email: string; roleId: string; site: string };

const seedUsers: User[] = [
  {
    id: "u-1",
    name: currentUser.name,
    email: currentUser.email,
    roleId: "cardiologist",
    site: "Cardioline Milano",
  },
  {
    id: "u-2",
    name: "Carlos Almeida",
    email: "c.almeida@hospital.com",
    roleId: "ecg-technician",
    site: "Cardioline São Paulo",
  },
  {
    id: "u-3",
    name: "Andrea Bigazzi",
    email: "a.bigazzi@hospital.com",
    roleId: "department-manager",
    site: "Cardioline Milano",
  },
  {
    id: "u-4",
    name: "Gabriel Kruschewsky Mattos Vaz",
    email: "g.vaz@hospital.com",
    roleId: "system-administrator",
    site: "Cardioline São Paulo",
  },
  {
    id: "u-5",
    name: "Dr. Lucas Martin",
    email: "l.martin@overread.io",
    roleId: "overreading-physician",
    site: "Overreading partner",
  },
  {
    id: "u-6",
    name: "Chiara Mancini",
    email: "c.mancini@farmacia.it",
    roleId: "point-of-care-operator",
    site: "Farmacia Centrale",
  },
];

/**
 * Users administration. The role a user carries is the single most
 * consequential thing about their account, so it is a column in the list and a
 * first-class control in the form — not free text.
 */
export function UsersAdminPage() {
  const [users, setUsers] = React.useState<User[]>(seedUsers);
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<User | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<User | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);

  const roleOf = (id: string) => seedRoles.find((role) => role.id === id);

  const list = users.filter((user) =>
    `${user.name} ${user.email} ${roleOf(user.roleId)?.name ?? ""} ${user.site}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const save = (user: User) => {
    setUsers((current) =>
      current.some((item) => item.id === user.id)
        ? current.map((item) => (item.id === user.id ? user : item))
        : [user, ...current],
    );
    setEditing(null);
    setCreating(false);
    setToast(`${user.name} saved in this prototype.`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border p-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users..."
            className="bg-muted pl-9"
          />
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus />
          Add User
        </Button>
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-[820px] w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Site</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((user) => {
                const role = roleOf(user.roleId);
                return (
                  <tr key={user.id} className="transition-colors hover:bg-muted/70">
                    <td className="px-5 py-4">
                      <span className="block font-medium text-foreground">{user.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {role ? (
                        <>
                          <Badge variant="secondary">{role.name}</Badge>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            Initial page: {moduleById(role.landing).label}
                          </span>
                        </>
                      ) : (
                        <Badge variant="destructive">No role</Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{user.site}</td>
                    <td className="px-5 py-4">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Edit ${user.name}`}
                          onClick={() => setEditing(user)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Remove ${user.name}`}
                          onClick={() => setDeleting(user)}
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

      <UserFormModal
        open={creating || Boolean(editing)}
        user={editing}
        onCancel={() => {
          setEditing(null);
          setCreating(false);
        }}
        onSave={save}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete user"
        description={`${deleting?.name ?? "This user"} loses access immediately. Exams and reports they already signed are kept.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          setUsers((current) => current.filter((user) => user.id !== deleting?.id));
          setToast(`${deleting?.name} removed from this prototype.`);
          setDeleting(null);
        }}
      />
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </Card>
  );
}

function UserFormModal({
  open,
  user,
  onCancel,
  onSave,
}: {
  open: boolean;
  user: User | null;
  onCancel: () => void;
  onSave: (user: User) => void;
}) {
  const blank: User = { id: "", name: "", email: "", roleId: "cardiologist", site: "" };
  const [draft, setDraft] = React.useState<User>(user ?? blank);

  React.useEffect(() => {
    if (open) setDraft(user ?? { ...blank, id: `u-${Date.now()}` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  const role: Role | undefined = seedRoles.find((item) => item.id === draft.roleId);
  const granted = role ? countGranted(role) : null;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="max-w-xl">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.name.trim()) onSave({ ...draft, name: draft.name.trim() });
          }}
        >
          <DialogHeader>
            <DialogTitle>{user ? "Edit user" : "Add user"}</DialogTitle>
            <DialogDescription>
              The role decides what this person can reach once they sign in.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="user-name">Full name</Label>
              <Input
                id="user-name"
                autoFocus
                value={draft.name}
                onChange={(event) => setDraft((c) => ({ ...c, name: event.target.value }))}
                required
                placeholder="Type here"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="user-email">Email address</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={draft.email}
                  onChange={(event) => setDraft((c) => ({ ...c, email: event.target.value }))}
                  placeholder="name@hospital.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-site">Site</Label>
                <Input
                  id="user-site"
                  value={draft.site}
                  onChange={(event) => setDraft((c) => ({ ...c, site: event.target.value }))}
                  placeholder="e.g. Cardioline Milano"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select
                value={draft.roleId}
                onValueChange={(value) => setDraft((c) => ({ ...c, roleId: value }))}
              >
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {seedRoles.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* What the choice actually means, so assigning a role is not a
                  guess from its name alone. */}
              {role && granted && (
                <div className="rounded-md border border-border bg-muted/50 px-3 py-3">
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                  <dl className="mt-2 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
                    <Fact label="Initial page" value={moduleById(role.landing).label} />
                    <Fact
                      label="Sees"
                      value={dataScopes.find((s) => s.id === role.scope)?.label ?? "—"}
                    />
                    <Fact
                      label="Grants"
                      value={`${granted.modules} modules · ${granted.capabilities} features`}
                    />
                  </dl>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-7">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{user ? "Save user" : "Add user"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium uppercase tracking-wide text-muted-foreground/80">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}
