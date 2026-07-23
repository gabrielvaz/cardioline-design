'use client';

import { Grid2X2, LayoutList, Settings2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../components/button';
import { Checkbox } from '../components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/dropdown-menu';
import { cn } from '../lib/utils';

export type TableDensity = 'compact' | 'comfortable' | 'spacious';
export type TableColumnSetting = { id: string; label: string; locked?: boolean };
export type TableViewSetting = {
  value: 'cards' | 'table';
  onValueChange: (view: 'cards' | 'table') => void;
};

export function TableToolbarMenu({
  columns,
  visibleColumns,
  onVisibleColumnsChange,
  density,
  onDensityChange,
  view,
}: {
  columns: TableColumnSetting[];
  visibleColumns: string[];
  onVisibleColumnsChange: (columns: string[]) => void;
  density: TableDensity;
  onDensityChange: (density: TableDensity) => void;
  view?: TableViewSetting;
}) {
  const toggleColumn = (id: string) =>
    onVisibleColumnsChange(
      visibleColumns.includes(id)
        ? visibleColumns.filter((column) => column !== id)
        : [...visibleColumns, id],
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          aria-label="Table settings"
          className="shrink-0"
        >
          <Settings2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[23rem] p-0">
        <DropdownMenuLabel className="px-5 py-4 text-sm normal-case tracking-normal text-foreground">
          Table settings
        </DropdownMenuLabel>
        {view && (
          <>
            <DropdownMenuSeparator />
            <div className="px-5 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                View type
              </p>
              <div className="grid grid-cols-2 gap-2">
                <ViewOption
                  active={view.value === 'cards'}
                  icon={<Grid2X2 className="h-4 w-4" />}
                  label="Cards"
                  onClick={() => view.onValueChange('cards')}
                />
                <ViewOption
                  active={view.value === 'table'}
                  icon={<LayoutList className="h-4 w-4" />}
                  label="Table"
                  onClick={() => view.onValueChange('table')}
                />
              </div>
            </div>
          </>
        )}
        <DropdownMenuSeparator />
        <div className="px-5 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Row density
          </p>
          <div className="flex flex-wrap gap-2">
            {(['compact', 'comfortable', 'spacious'] as const).map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onDensityChange(option)}
                  className={cn(
                    'rounded-full border px-3.5 py-2 text-xs font-semibold capitalize transition-colors',
                    density === option
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/10',
                  )}
                >
                  {option}
                </button>
              ),
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="px-5 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Visible columns
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {columns.map((column) => (
              <label
                key={column.id}
                className={cn(
                  'flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                  column.locked
                    ? 'cursor-not-allowed border-border bg-muted text-muted-foreground'
                    : 'cursor-pointer border-border text-foreground hover:border-primary/40 hover:bg-primary/10',
                )}
              >
                <Checkbox
                  checked={column.locked || visibleColumns.includes(column.id)}
                  disabled={column.locked}
                  onCheckedChange={() => !column.locked && toggleColumn(column.id)}
                />
                <span className="min-w-0 flex-1 truncate">{column.label}</span>
                {column.locked && (
                  <span className="text-[10px] font-medium uppercase tracking-wide">
                    Required
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ViewOption({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/10',
      )}
    >
      {icon}
      {label}
    </button>
  );
}
