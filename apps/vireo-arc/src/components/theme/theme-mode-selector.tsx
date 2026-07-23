'use client';

import { Moon, Sun } from 'lucide-react';
import { cn } from '@cardioline/ui';
import { useTheme } from './theme-provider';

export function ThemeModeSelector() {
  const { theme, setTheme } = useTheme();
  const modes = [
    { value: 'light' as const, label: 'Light', Icon: Sun },
    { value: 'dark' as const, label: 'Dark', Icon: Moon },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-slate-700 dark:bg-slate-900/70" role="group" aria-label="Color theme">
      {modes.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-pressed={theme === value}
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors',
            theme === value
              ? 'bg-white text-[#071046] shadow-sm dark:bg-slate-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100',
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
