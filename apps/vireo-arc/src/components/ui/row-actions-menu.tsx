'use client';

import * as React from 'react';
import { MoreHorizontal, Trash2, type LucideIcon } from 'lucide-react';
import {
  Button,
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@cardioline/ui';

export type RowAction = { icon: LucideIcon; label: string; onSelect: () => void };

/**
 * Shared row "more" menu. Always ends in a Delete item that opens an
 * irreversible confirmation before calling onDelete. Optional `actions`
 * render above the Delete separator.
 */
export function RowActionsMenu({
  entity,
  name,
  actions = [],
  onDelete,
}: {
  entity: string;
  name: string;
  actions?: RowAction[];
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
              <action.icon />
              {action.label}
            </DropdownMenuItem>
          ))}
          {actions.length > 0 && <DropdownMenuSeparator />}
          {/* Defer opening so the menu fully closes first (avoids focus contention). */}
          <DropdownMenuItem destructive onSelect={() => window.setTimeout(() => setConfirmOpen(true), 0)}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmOpen}
        title={`Delete ${entity}`}
        description={`Are you sure you want to delete this ${entity.toLowerCase()}? This action is permanent and cannot be undone.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete();
        }}
      />
    </>
  );
}
