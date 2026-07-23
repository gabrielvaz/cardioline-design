'use client';

import * as React from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Button, Card, CardContent, Input, Label } from '@cardioline/ui';
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
  const [query, setQuery] = React.useState(''); const [toast, setToast] = React.useState<string | null>(null); const [createOpen, setCreateOpen] = React.useState(false); const [deleteItem, setDeleteItem] = React.useState<string | null>(null);
  const list = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  const create = (name: string, detail: string) => { const item = detail ? `${name} · ${detail}` : name; setItems((current) => [item, ...current]); setCreateOpen(false); setToast(`${singular} created in this prototype.`); };
  return <Card className="border-gray-200 bg-white shadow-sm"><div className="flex items-center justify-between gap-4 border-b border-gray-100 p-4"><div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${resource.toLowerCase()}...`} className="border-gray-200 bg-gray-50 pl-9" /></div><Button onClick={() => setCreateOpen(true)} className="bg-[#ee5b00] text-white hover:bg-[#d44e00]"><Plus className="mr-2" />Add {singular}</Button></div><CardContent className="p-0"><div className="overflow-x-auto"><table className="min-w-[560px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{list.map((item) => <tr key={item}><td className="px-5 py-4 font-medium text-gray-800">{item}</td><td className="px-5 py-4"><span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">Active</span></td><td className="px-5 py-4 text-right"><Button size="icon" variant="ghost" aria-label={`Remove ${item}`} onClick={() => setDeleteItem(item)} className="text-red-600 hover:bg-red-50"><Trash2 /></Button></td></tr>)}</tbody></table></div></CardContent><CreateResourceModal open={createOpen} resource={resource} onCancel={() => setCreateOpen(false)} onCreate={create} /><ConfirmDialog open={Boolean(deleteItem)} title={`Delete ${singular}`} description={`Are you sure you want to delete this ${singular.toLowerCase()}? This action is permanent and the data cannot be recovered.`} onCancel={() => setDeleteItem(null)} onConfirm={() => { setItems((current) => current.filter((item) => item !== deleteItem)); setToast(`${singular} removed from this prototype.`); setDeleteItem(null); }} /><PrototypeToast message={toast} onClose={() => setToast(null)} /></Card>;
}

function CreateResourceModal({ open, resource, onCancel, onCreate }: { open: boolean; resource: Resource; onCancel: () => void; onCreate: (name: string, detail: string) => void }) {
  const [name, setName] = React.useState(''); const [detail, setDetail] = React.useState('');
  React.useEffect(() => { if (open) { setName(''); setDetail(''); } }, [open]);
  if (!open) return null;
  const [firstLabel, secondLabel] = fieldLabels[resource]; const singular = resource.slice(0, -1);
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-labelledby="create-resource-title"><form onSubmit={(event) => { event.preventDefault(); if (name.trim()) onCreate(name.trim(), detail.trim()); }} className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl"><h2 id="create-resource-title" className="text-xl font-bold text-[#071046]">Add {singular}</h2><p className="mt-2 text-sm text-gray-500">Create a mock {singular.toLowerCase()} for this prototype.</p><div className="mt-6 space-y-5"><div className="space-y-2"><Label htmlFor="resource-name">{firstLabel}</Label><Input id="resource-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} required placeholder="Type here" /></div><div className="space-y-2"><Label htmlFor="resource-detail">{secondLabel}</Label><Input id="resource-detail" value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="Type here" /></div></div><div className="mt-7 flex justify-end gap-3"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" className="bg-[#ee5b00] text-white hover:bg-[#d44e00]">Add {singular}</Button></div></form></div>;
}
