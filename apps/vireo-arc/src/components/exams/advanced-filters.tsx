'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@cardioline/ui';
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
    <Dialog open onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle>Advanced search</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {groups.map(([name, options]) => (
            <div key={name} className="rounded-lg border border-border">
              <button onClick={() => setOpen(open === name ? '' : name)} aria-expanded={open === name} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-foreground">
                {name}
                <ChevronDown className={`h-4 w-4 text-primary transition-transform ${open === name ? 'rotate-180' : ''}`} />
              </button>
              {open === name && (
                <div className="grid gap-1 border-t border-border px-4 py-3 sm:grid-cols-2">
                  {options.map((option) => <SelectionCheckbox key={option} checked={checked.includes(option)} onChange={() => toggle(option)} label={option} />)}
                </div>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setChecked([])}>Reset</Button>
          <Button onClick={onClose}>Apply {checked.length ? `(${checked.length})` : ''}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
