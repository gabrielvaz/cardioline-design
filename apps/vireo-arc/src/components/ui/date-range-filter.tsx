"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  cn,
} from "@cardioline/ui";

function formatDate(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

export function DateRangeFilter({
  label,
  from,
  to,
  onApply,
}: {
  label: string;
  from: string;
  to: string;
  onApply: (range: { from: string; to: string }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState({ from, to });
  const active = Boolean(from || to);
  React.useEffect(() => {
    if (open) setDraft({ from, to });
  }, [open, from, to]);
  const summary = active
    ? `${formatDate(from) || "..."} - ${formatDate(to) || "..."}`
    : "Any";
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors",
          active
            ? "border-primary/40 bg-primary/10 text-foreground"
            : "border-input bg-background text-foreground hover:border-primary/40",
        )}
      >
        {label}: {summary}
        <ChevronDown className="h-3.5 w-3.5 text-primary" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Filter by {label.toLowerCase()}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={draft.from}
              onChange={(event) =>
                setDraft((current) => ({ ...current, from: event.target.value }))
              }
              className="h-9"
              aria-label={`${label} from`}
            />
            <span className="text-xs text-gray-400">to</span>
            <Input
              type="date"
              value={draft.to}
              onChange={(event) =>
                setDraft((current) => ({ ...current, to: event.target.value }))
              }
              className="h-9"
              aria-label={`${label} to`}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDraft({ from: "", to: "" });
                onApply({ from: "", to: "" });
                setOpen(false);
              }}
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
