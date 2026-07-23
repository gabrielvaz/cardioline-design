'use client';

import * as React from 'react';
import type { TableDensity } from '@cardioline/ui';

const STORAGE_KEY = 'cardioline-table-density';

/**
 * Stores the row-density choice once and reuses it on every clinical listing.
 * The effect keeps server and first client render identical, then restores the
 * user's cached preference without introducing a hydration mismatch.
 */
export function useGlobalTableDensity() {
  const [density, setDensityState] = React.useState<TableDensity>('comfortable');

  React.useEffect(() => {
    const cached = window.localStorage.getItem(STORAGE_KEY);
    if (cached === 'compact' || cached === 'comfortable' || cached === 'spacious') setDensityState(cached);
  }, []);

  const setDensity = React.useCallback((nextDensity: TableDensity) => {
    setDensityState(nextDensity);
    window.localStorage.setItem(STORAGE_KEY, nextDensity);
  }, []);

  return [density, setDensity] as const;
}
