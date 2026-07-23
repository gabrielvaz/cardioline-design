'use client';

import * as React from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import {
  Badge, Button, Card, CardContent,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
  Input, Label,
} from '@cardioline/ui';
import { PrototypeToast } from '@/components/ui/prototype-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const seedData = {
  Users: ['Carlos Almeida', 'Andrea Bigazzi', 'Gabriel Kruschewsky Mattos Vaz'],
  Sites: ['Cardioline São Paulo', 'Cardioline Milano', 'Cardioline London'],
  Groups: ['Cardiology', 'Nursing', 'Technical support'],
  Roles: ['Administrator', 'Cardiologist', 'Technician'],
  Devices: ['ECG100L · Room 302', 'Walk400h · Ward B', 'ECG200+ · ER'],
} as const;
type Resource = keyof typeof seedData;
const fieldLabels: Record<Resource, [string, string]> = { Users: ['Full name', 'Role'], Sites: ['Site name', 'City'], Groups: ['Group name', 'Description'], Roles: ['Role name', 'Description'], Devices: ['Device name', 'Location'] };

export function AdminResourcePage({ resource }: { resource: Resource }) {
  const singular = resource.slice(0, -1);
  const [items, setItems] = React.useState<string[]>([...seedData[resource]]);
  const [query, setQuery] = React.useState('');
  const [toast, setToast] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState<string | null>(null);
  const list = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  const create = (name: string, detail: string) => { const item = detail ? `${name} · ${detail}` : name; setItems((current) => [item, ...current]); setCreateOpen(false); setToast(`${singular} created in this prototype.`); };
  return (
    <Card>
      <div className="flex items-center justify-between gap-4 border-b border-border p-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${resource.toLowerCase()}...`} className="bg-muted pl-9" />
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="mr-2" />Add {singular}</Button>
      </div>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-[560px] w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {list.map((item) => (
                <tr key={item}>
                  <td title={item} className="px-5 py-4 font-medium text-foreground">{item}</td>
                  <td className="px-5 py-4"><Badge variant="success">Active</Badge></td>
                  <td className="px-5 py-4 text-right"><Button size="icon" variant="ghost" aria-label={`Remove ${item}`} onClick={() => setDeleteItem(item)} className="text-destructive hover:bg-destructive/10"><Trash2 /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CreateResourceModal open={createOpen} resource={resource} onCancel={() => setCreateOpen(false)} onCreate={create} />
      <ConfirmDialog open={Boolean(deleteItem)} title={`Delete ${singular}`} description={`Are you sure you want to delete this ${singular.toLowerCase()}? This action is permanent and the data cannot be recovered.`} onCancel={() => setDeleteItem(null)} onConfirm={() => { setItems((current) => current.filter((item) => item !== deleteItem)); setToast(`${singular} removed from this prototype.`); setDeleteItem(null); }} />
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </Card>
  );
}

function CreateResourceModal({ open, resource, onCancel, onCreate }: { open: boolean; resource: Resource; onCancel: () => void; onCreate: (name: string, detail: string) => void }) {
  const [name, setName] = React.useState('');
  const [detail, setDetail] = React.useState('');
  React.useEffect(() => { if (open) { setName(''); setDetail(''); } }, [open]);
  const [firstLabel, secondLabel] = fieldLabels[resource];
  const singular = resource.slice(0, -1);
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onCancel(); }}>
      <DialogContent>
        <form onSubmit={(event) => { event.preventDefault(); if (name.trim()) onCreate(name.trim(), detail.trim()); }}>
          <DialogHeader>
            <DialogTitle>Add {singular}</DialogTitle>
            <DialogDescription>Create a mock {singular.toLowerCase()} for this prototype.</DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-5">
            <div className="space-y-2"><Label htmlFor="resource-name">{firstLabel}</Label><Input id="resource-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} required placeholder="Type here" /></div>
            <div className="space-y-2"><Label htmlFor="resource-detail">{secondLabel}</Label><Input id="resource-detail" value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="Type here" /></div>
          </div>
          <DialogFooter className="mt-7">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Add {singular}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
