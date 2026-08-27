'use client';

import * as React from 'react';
import type { TableDensity } from '@cardioline/ui';
import { useSession } from '@/lib/session';

/**
 * Row density for the clinical listings.
 *
 * The value lives on the session (chosen during the first-login setup, changed
 * later in Settings) so tables, the Exam Inbox and the density tokens in
 * globals.css all move together. The per-table control still offers `spacious`
 * as a local override; picking Compact or Comfortable writes back to the
 * session, which is the shared source.
 */
export function useGlobalTableDensity() {
  const { state, setDensity } = useSession();
  const [local, setLocal] = React.useState<TableDensity | null>(null);

  const density: TableDensity = local ?? state.density;

  const setTableDensity = React.useCallback(
    (next: TableDensity) => {
      if (next === 'spacious') {
        setLocal('spacious');
        return;
      }
      setLocal(null);
      setDensity(next);
    },
    [setDensity],
  );

  return [density, setTableDensity] as const;
}
