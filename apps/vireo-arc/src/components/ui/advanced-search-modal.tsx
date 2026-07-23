'use client';

import * as React from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@cardioline/ui';
import { SelectionCheckbox } from './selection-checkbox';

type SearchGroup = { label: string; options: string[] };

export function AdvancedSearchModal({ open, onOpenChange, title, description, groups, onApply }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; groups: SearchGroup[]; onApply?: (selected: string[]) => void }) {
  const [expanded, setExpanded] = React.useState(groups[0]?.label ?? '');
  const [selected, setSelected] = React.useState<string[]>([]);
  React.useEffect(() => { if (open) { setExpanded(groups[0]?.label ?? ''); setSelected([]); } }, [open, groups]);
  const toggle = (option: string) => setSelected((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader><div className="space-y-3">{groups.map((group) => <section key={group.label} className="overflow-hidden rounded-lg border border-slate-200"><button type="button" onClick={() => setExpanded(expanded === group.label ? '' : group.label)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800"><span>{group.label}</span><ChevronDown className={`h-4 w-4 text-[#ee5b00] transition-transform ${expanded === group.label ? 'rotate-180' : ''}`} /></button>{expanded === group.label && <div className="grid gap-1 border-t border-slate-100 px-4 py-3 sm:grid-cols-2">{group.options.map((option) => <SelectionCheckbox key={option} checked={selected.includes(option)} onChange={() => toggle(option)} label={option} />)}</div>}</section>)}</div><DialogFooter><Button variant="outline" onClick={() => setSelected([])}>Reset</Button><Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={() => { onApply?.(selected); onOpenChange(false); }}><SlidersHorizontal className="mr-2" />Apply {selected.length ? `(${selected.length})` : ''}</Button></DialogFooter></DialogContent></Dialog>;
}
