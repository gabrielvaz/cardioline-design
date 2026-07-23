'use client';

import * as React from 'react';
import { MoreHorizontal, Trash2, type LucideIcon } from 'lucide-react';
import { Button } from '../components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/dropdown-menu';
import { ConfirmDialog } from './confirm-dialog';

export type RowAction = { icon?: LucideIcon; label: string; onSelect: () => void };

/**
 * Generic row "more" menu block. Always ends in a Delete item that opens an
 * irreversible confirmation before calling onDelete. Optional `actions`
 * render above the Delete separator. The caller supplies the exact confirm
 * copy via `confirmTitle`/`confirmDescription`, so this block carries no
 * baked-in wording.
 */
export function RowActionsMenu({
  name,
  actions = [],
  deleteLabel = 'Delete',
  confirmTitle,
  confirmDescription,
  onDelete,
}: {
  name: string;
  actions?: RowAction[];
  deleteLabel?: string;
  confirmTitle: string;
  confirmDescription: string;
  onDelete: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" aria-label={`More actions for ${name}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {actions.map((action) => (
            <DropdownMenuItem key={action.label} onSelect={() => action.onSelect()}>
              {action.icon ? <action.icon /> : null}
              {action.label}
            </DropdownMenuItem>
          ))}
          {actions.length > 0 && <DropdownMenuSeparator />}
          {/* Defer opening so the menu fully closes first (avoids focus contention). */}
          <DropdownMenuItem destructive onSelect={() => window.setTimeout(() => setConfirmOpen(true), 0)}>
            <Trash2 />
            {deleteLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete();
        }}
      />
    </>
  );
}
