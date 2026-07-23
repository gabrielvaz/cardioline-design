import * as React from "react";

import { cn } from "@cardioline/ui";

export const pageTitleClassName =
  "text-2xl font-bold tracking-tight text-foreground";
export const pageSubtitleClassName = "mt-1 text-sm text-muted-foreground";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className={pageTitleClassName}>{title}</h1>
        {description && <p className={pageSubtitleClassName}>{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}
