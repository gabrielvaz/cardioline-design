'use client';

import { Button } from '@cardioline/ui';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

/** Consistent confirmation for irreversible prototype actions. */
export function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', onCancel, onConfirm }: ConfirmDialogProps) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/25 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title"><section className="w-full max-w-[34rem] rounded-lg bg-white p-7 shadow-[0_12px_28px_rgba(15,23,42,0.22)]"><h2 id="confirm-dialog-title" className="text-xl font-bold text-slate-800">{title}</h2><p className="mt-7 max-w-md text-lg leading-7 text-slate-700">{description}</p><div className="mt-7 flex justify-end gap-3"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="button" onClick={onConfirm} className="bg-[#e93d42] text-white hover:bg-[#cf3238]">{confirmLabel}</Button></div></section></div>;
}
