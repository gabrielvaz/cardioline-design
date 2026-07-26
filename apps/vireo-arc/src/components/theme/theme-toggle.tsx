'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@cardioline/ui';
import { useTheme } from '@/components/theme/theme-provider';

/**
 * Floating theme switch used on the mock authentication routes, where the
 * dashboard shell (and its own toggle) is not rendered.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={theme === 'dark' ? 'Use light mode' : 'Use dark mode'}
      className="fixed bottom-6 right-6 z-20 rounded-full bg-card shadow-md"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
