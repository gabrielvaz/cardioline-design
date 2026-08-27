"use client";

import * as React from "react";
import { cn } from "@cardioline/ui";
import { moduleLabel, navigationFor, type Role } from "@/lib/roles";
import type { Density } from "@/lib/session";

/**
 * A scale model of the application the current choices produce: the sidebar
 * the role will actually get, its home, and rows at the chosen density.
 *
 * It is drawn from the same `role` object the app runs on, so it cannot drift
 * from the real thing — change a preset's access and this preview changes with
 * it. Purely decorative for assistive tech; the choices are announced by the
 * controls themselves.
 */
export function WorkspacePreview({
  role,
  density = "comfortable",
  className,
}: {
  role: Role;
  density?: Density;
  className?: string;
}) {
  const nav = navigationFor(role);
  const home = role.landing;
  const rows = density === "compact" ? 7 : 4;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div className="flex h-full min-h-[236px]">
        {/* Sidebar */}
        <div className="w-[86px] shrink-0 border-r border-border bg-muted/40 p-2.5">
          <div className="mb-3 flex items-center gap-1">
            <span className="text-[7px] font-bold tracking-wider text-primary">
              VIREO
            </span>
            <span className="text-[7px] font-bold tracking-wider text-muted-foreground">
              ARK
            </span>
          </div>
          <div className="space-y-1">
            {nav.map((module) => (
              <div
                key={module.id}
                className={cn(
                  "flex items-center gap-1 rounded px-1.5 py-1",
                  module.id === home
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-[2px]",
                    module.id === home ? "bg-primary" : "bg-muted-foreground/40",
                  )}
                />
                <span className="truncate text-[6.5px] font-medium leading-none">
                  {moduleLabel(role, module.id)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-[8px] font-bold text-foreground">
              {moduleLabel(role, home)}
            </span>
            <span className="rounded bg-primary px-1.5 py-0.5 text-[6px] font-bold text-primary-foreground">
              {role.preset?.actions[0] ?? "Open"}
            </span>
          </div>

          {/* Priority cards */}
          <div className="grid grid-cols-4 gap-1 px-3 pt-2">
            {(role.preset?.priorities ?? ["Overview"]).slice(0, 4).map((label) => (
              <div
                key={label}
                className="rounded border border-border bg-background px-1 py-1"
              >
                <div className="h-1 w-3/5 rounded-full bg-primary/50" />
                <p className="mt-1 line-clamp-2 text-[5.5px] leading-tight text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Rows at the chosen density */}
          <div className="mt-2 flex-1 px-3 pb-3">
            <div className="overflow-hidden rounded border border-border">
              {Array.from({ length: rows }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-1.5 border-b border-border/60 px-1.5 last:border-b-0",
                    density === "compact" ? "py-[3px]" : "py-[7px]",
                    index % 2 === 1 && "bg-muted/40",
                  )}
                >
                  <span className="h-1 w-1 rounded-full bg-primary/60" />
                  <span className="h-[3px] flex-1 rounded-full bg-muted-foreground/25" />
                  <span className="h-[3px] w-6 rounded-full bg-muted-foreground/15" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
