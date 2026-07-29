'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button, Checkbox, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@cardioline/ui';

const groups = [
  ['Exam type', ['Resting ECG', 'ECG single lead', 'Holter ECG', 'Stress test']],
  ['Status', ['Pending review', 'Normal', 'Abnormal', 'Borderline']],
  ['Summary', ['Normal', 'Borderline', 'Pending Review']],
  ['STAT', ['STAT only']],
  ['Pediatric', ['Pediatric only']],
  ['Units', ['Via Paoletti', 'Bella Salute', 'San Giovanni']],
] as const;

export function AdvancedExamFilters({ onClose, onApply }: { onClose: () => void; onApply?: (selections: Record<string, string[]>) => void }) {
  const [open, setOpen] = React.useState('Exam type');
  const [checked, setChecked] = React.useState<Record<string, string[]>>({});
  const toggle = (group: string, option: string) =>
    setChecked((current) => {
      const selected = current[group] ?? [];
      return {
        ...current,
        [group]: selected.includes(option)
          ? selected.filter((item) => item !== option)
          : [...selected, option],
      };
    });
  const count = Object.values(checked).flat().length;

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
                  {options.map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted">
                      <Checkbox checked={(checked[name] ?? []).includes(option)} onCheckedChange={() => toggle(name, option)} />
                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setChecked({})}>Reset</Button>
          <Button onClick={() => onApply ? onApply(checked) : onClose()}>Apply {count ? `(${count})` : ''}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
