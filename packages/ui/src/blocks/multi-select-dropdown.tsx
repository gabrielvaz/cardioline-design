'use client';
import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Checkbox } from '../components/checkbox';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from '../components/dropdown-menu';

export type MultiSelectOption = { label: string; value?: string; group?: string };

export function MultiSelectDropdown({
  label, options, value, onChange, align = 'start',
  summary = (count) => (count ? `: ${count} selected` : ''), triggerClassName,
}: {
  label: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  align?: 'start' | 'end';
  summary?: (count: number) => string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const keyOf = (o: MultiSelectOption) => o.value ?? o.label;
  const toggle = (k: string) =>
    onChange(value.includes(k) ? value.filter((v) => v !== k) : [...value, k]);
  const groups = options.reduce<{ name?: string; items: MultiSelectOption[] }[]>((acc, o) => {
    const last = acc.at(-1);
    if (last && last.name === o.group) last.items.push(o);
    else acc.push({ name: o.group, items: [o] });
    return acc;
  }, []);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors',
            value.length ? 'border-primary/40 bg-primary/10 text-foreground' : 'border-input bg-background text-foreground hover:border-primary/40',
            triggerClassName,
          )}
        >
          {label}{summary(value.length)}
          <ChevronDown className={cn('h-3.5 w-3.5 text-primary transition-transform', open && 'rotate-180')} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="max-h-[min(66vh,32rem)] w-72 overflow-y-auto p-2">
        <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filter {label.toLowerCase()}</p>
        {groups.map((group, index) => (
          <div key={`${group.name ?? 'g'}-${index}`} className={index ? 'mt-2 border-t border-border pt-2' : ''}>
            {group.name && <p className="px-2 pb-1 text-sm font-semibold text-foreground">{group.name}</p>}
            {group.items.map((option) => {
              const k = keyOf(option);
              return (
                <label key={k} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted">
                  <Checkbox checked={value.includes(k)} onCheckedChange={() => toggle(k)} />
                  {option.label}
                </label>
              );
            })}
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-border px-2 pt-3">
          <button type="button" onClick={() => onChange([])} className="text-xs font-semibold text-muted-foreground hover:text-foreground">Clear</button>
          <button type="button" onClick={() => setOpen(false)} className="text-xs font-semibold text-primary hover:text-primary/80">Done</button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
