'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@cardioline/ui';
import { SelectionCheckbox } from '@/components/ui/selection-checkbox';

const groups = [
  ['Exam type', ['Resting ECG', 'ECG single lead (PDF)', 'Holter ECG', 'Holter ECG (PDF)', 'Stress test', 'Spirometry']],
  ['Status', ['Pending review', 'Normal', 'Abnormal', 'Draft']],
  ['Summary', ['Normal', 'Borderline', 'Critical']],
  ['STAT', ['STAT only']],
  ['Pediatric', ['Pediatric only']],
  ['Units', ['Room 302', 'Ward B', 'ER']],
] as const;

export function AdvancedExamFilters({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = React.useState('Exam type');
  const [checked, setChecked] = React.useState<string[]>([]);
  const toggle = (name: string) => setChecked((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-label="Advanced search">
      <section className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-[#071046]">Advanced search</h2><button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900">Close</button></div>
        <div className="space-y-3">{groups.map(([name, options]) => <div key={name} className="rounded-lg border border-gray-200 bg-white"><button onClick={() => setOpen(open === name ? '' : name)} aria-expanded={open === name} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-800">{name}<ChevronDown className={`h-4 w-4 text-[#ee5b00] transition-transform ${open === name ? 'rotate-180' : ''}`} /></button>{open === name && <div className="grid gap-1 border-t border-gray-100 px-4 py-3 sm:grid-cols-2">{options.map((option) => <SelectionCheckbox key={option} checked={checked.includes(option)} onChange={() => toggle(option)} label={option} />)}</div>}</div>)}</div>
        <div className="mt-5 flex justify-end gap-3"><Button variant="outline" onClick={() => setChecked([])}>Reset</Button><Button onClick={onClose} className="bg-primary text-white">Apply {checked.length ? `(${checked.length})` : ''}</Button></div>
      </section>
    </div>
  );
}
