'use client';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../components/alert-dialog';
import { cn } from '../lib/utils';

export function ConfirmDialog({
  open, title, description, confirmLabel = 'Delete', destructive = true, onCancel, onConfirm,
}: {
  open: boolean; title: string; description: string; confirmLabel?: string;
  destructive?: boolean; onCancel: () => void; onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => { if (!next) onCancel(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(destructive && 'bg-destructive text-destructive-foreground hover:bg-destructive/90')}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
