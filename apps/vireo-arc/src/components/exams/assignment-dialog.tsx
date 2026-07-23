"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@cardioline/ui";

export type AssignableExam = {
  id: string;
  patient: string;
  patientId: string;
  type: string;
};

const reportingProfessionals = [
  { name: "Dr. Sarah Jenkins", specialty: "Cardiologist", assigned: 8, online: true },
  { name: "Dr. Miguel Oliveira", specialty: "Cardiologist", assigned: 5, online: true },
  { name: "Dr. Elena Rossi", specialty: "Electrophysiologist", assigned: 11, online: false },
  { name: "Dr. Lucas Martin", specialty: "Cardiologist", assigned: 3, online: true },
];

/** Shared worklist assignment modal for Inbox and the main examination list. */
export function AssignmentDialog({
  exam,
  onOpenChange,
  onAssign,
}: {
  exam: AssignableExam | null;
  onOpenChange: (open: boolean) => void;
  onAssign: (professional: string) => void;
}) {
  const [professional, setProfessional] = React.useState(reportingProfessionals[0].name);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (exam) {
      setProfessional(reportingProfessionals[0].name);
      setQuery("");
    }
  }, [exam]);

  const professionals = reportingProfessionals.filter((item) =>
    `${item.name} ${item.specialty}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Dialog open={Boolean(exam)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign exam</DialogTitle>
          <DialogDescription>Choose the reporting professional responsible for {exam?.id}.</DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
          <p className="font-medium text-foreground">{exam?.patient}</p>
          <p className="mt-1 text-sm text-muted-foreground">{exam?.type} · {exam?.patientId}</p>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">Reporting professional</p>
            <p className="mt-1 text-xs text-muted-foreground">Select one professional to receive this exam.</p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search doctors..." className="h-10 bg-background pl-9" />
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {professionals.map((item) => {
              const selected = item.name === professional;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setProfessional(item.name)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                    selected ? "border-primary/30 bg-primary/10" : "border-border bg-card hover:border-primary/30 hover:bg-muted/60",
                  )}
                >
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", item.online ? "bg-emerald-500" : "bg-muted-foreground/50")} aria-label={item.online ? "Online" : "Offline"} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">{item.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{item.specialty} · {item.online ? "Online" : "Offline"}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-semibold text-foreground">{item.assigned}</span>
                    <span className="block text-[11px] text-muted-foreground">assigned</span>
                  </span>
                </button>
              );
            })}
            {!professionals.length && <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">No professionals match this search.</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onAssign(professional)}>Assign exam</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
