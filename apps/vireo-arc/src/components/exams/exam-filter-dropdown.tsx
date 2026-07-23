'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { SelectionCheckbox } from '@/components/ui/selection-checkbox';

export type ExamFilterOption = { label: string; group?: string };
type MenuPosition = { top: number; left: number };
type ExamFilterDropdownProps = { label: string; options: ExamFilterOption[]; selected: string[]; onChange: (values: string[]) => void; accent?: boolean; align?: 'left' | 'right'; selectedText?: string; triggerClassName?: string };

export function ExamFilterDropdown({ label, options, selected, onChange, accent = false, align = 'left', selectedText, triggerClassName = '' }: ExamFilterDropdownProps) {
  const [open, setOpen] = React.useState(false); const [position, setPosition] = React.useState<MenuPosition>({ top: 0, left: 0 });
  const rootRef = React.useRef<HTMLDivElement>(null); const triggerRef = React.useRef<HTMLButtonElement>(null); const menuRef = React.useRef<HTMLDivElement>(null);
  const updatePosition = React.useCallback(() => { const rect = triggerRef.current?.getBoundingClientRect(); if (!rect) return; setPosition({ top: rect.bottom + 8, left: align === 'right' ? Math.max(12, rect.right - 288) : rect.left }); }, [align]);
  const toggleOpen = () => { if (!open) updatePosition(); setOpen((value) => !value); };

  React.useEffect(() => { const close = (event: MouseEvent) => { const target = event.target as Node; if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false); }; const reposition = () => open && updatePosition(); document.addEventListener('mousedown', close); window.addEventListener('resize', reposition); window.addEventListener('scroll', reposition, true); return () => { document.removeEventListener('mousedown', close); window.removeEventListener('resize', reposition); window.removeEventListener('scroll', reposition, true); }; }, [open, updatePosition]);

  const toggle = (value: string) => onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  const groups = options.reduce<{ name?: string; options: ExamFilterOption[] }[]>((items, option) => { const last = items.at(-1); if (last && last.name === option.group) last.options.push(option); else items.push({ name: option.group, options: [option] }); return items; }, []);
  const menu = open && typeof document !== 'undefined' ? createPortal(<div ref={menuRef} style={position} className="fixed z-[90] max-h-[min(66vh,32rem)] w-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.18)]"><p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Filter {label.toLowerCase()}</p>{groups.map((group, index) => <div key={`${group.name}-${index}`} className={index ? 'mt-2 border-t border-slate-100 pt-2' : ''}>{group.name && <p className="px-2 pb-1 text-sm font-bold text-slate-700">{group.name}</p>}{group.options.map((option) => <SelectionCheckbox key={option.label} checked={selected.includes(option.label)} onChange={() => toggle(option.label)} label={option.label} />)}</div>)}<div className="mt-2 flex justify-between border-t border-slate-100 px-2 pt-3"><button type="button" onClick={() => onChange([])} className="text-xs font-semibold text-slate-500 hover:text-slate-900">Clear</button><button type="button" onClick={() => setOpen(false)} className="text-xs font-semibold text-[#ee5b00] hover:text-[#c94b00]">Done</button></div></div>, document.body) : null;

  return <div ref={rootRef} className="relative"><button ref={triggerRef} type="button" aria-expanded={open} onClick={toggleOpen} className={`flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors ${accent || selected.length ? 'border-sky-100 bg-sky-100 text-slate-800' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'} ${triggerClassName}`}>{label}{selectedText ?? (selected.length ? `: ${selected.length} selected` : '')}<ChevronDown className={`h-3.5 w-3.5 text-[#ee5b00] transition-transform ${open ? 'rotate-180' : ''}`} /></button>{menu}</div>;
}
