'use client';

import { Check } from 'lucide-react';

type SelectionCheckboxProps = {
  checked: boolean;
  onChange: () => void;
  label: string;
  className?: string;
};

/** Shared checkbox treatment for multi-select menus and advanced filters. */
export function SelectionCheckbox({ checked, onChange, label, className = '' }: SelectionCheckboxProps) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 ${className}`}>
      <input className="sr-only" type="checkbox" checked={checked} onChange={onChange} />
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${checked ? 'border-[#ee5b00] bg-[#ee5b00] text-white' : 'border-slate-300 bg-white'}`}>
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      {label}
    </label>
  );
}
