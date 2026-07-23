'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Accessible on/off toggle (role="switch"). Kept dependency-free — Radix Switch
 * is not part of the installed set — while matching the Beat control language.
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, ...props }, ref) => {
    const [internal, setInternal] = React.useState(defaultChecked ?? false);
    const isControlled = checked !== undefined;
    const value = isControlled ? checked : internal;

    const toggle = () => {
      if (disabled) return;
      if (!isControlled) setInternal(!value);
      onCheckedChange?.(!value);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        data-state={value ? 'checked' : 'unchecked'}
        onClick={toggle}
        className={cn(
          'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          value ? 'bg-primary' : 'bg-input',
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-sm ring-0 transition-transform',
            value ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    );
  },
);
Switch.displayName = 'Switch';

export { Switch };
