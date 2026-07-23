import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        /* Brand */
        default:  'border-transparent bg-primary/12 text-primary',
        secondary:'border-transparent bg-secondary text-secondary-foreground',
        outline:  'border-border text-foreground',
        /* Semantic status — readable on light and dark grounds */
        success:  'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        warning:  'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
        destructive:'border-transparent bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
        neutral:  'border-transparent bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
