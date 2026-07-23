'use client';

import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc';

export function SortableHeader({ label, active, direction, onClick, align = 'left' }: { label: string; active: boolean; direction: SortDirection; onClick: () => void; align?: 'left' | 'right' }) {
  const Icon = active ? direction === 'asc' ? ArrowUp : ArrowDown : ChevronsUpDown;
  return <button type="button" onClick={onClick} className={`inline-flex w-full items-center gap-1.5 font-medium uppercase tracking-wide transition-colors hover:text-slate-900 ${align === 'right' ? 'justify-end' : 'justify-start'}`}><span>{label}</span><Icon className={`h-3.5 w-3.5 ${active ? 'text-[#ee5b00]' : 'text-slate-400'}`} /></button>;
}
