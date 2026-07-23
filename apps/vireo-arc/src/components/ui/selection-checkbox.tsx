'use client';

import { Checkbox } from '@cardioline/ui';

type SelectionCheckboxProps = {
  checked: boolean;
  onChange: () => void;
  label: string;
  className?: string;
};

/** Shared checkbox row for multi-select menus and advanced filters. */
export function SelectionCheckbox({ checked, onChange, label, className = '' }: SelectionCheckboxProps) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted ${className}`}>
      <Checkbox checked={checked} onCheckedChange={() => onChange()} />
      {label}
    </label>
  );
}
