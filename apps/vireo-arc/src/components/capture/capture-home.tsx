"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CloudOff,
  Plus,
  RefreshCw,
  Send,
  Wifi,
} from "lucide-react";
import { Badge, Button, Card, CardContent, cn } from "@cardioline/ui";
import { PrototypeToast } from "@/components/ui/prototype-toast";
import { useSession } from "@/lib/session";
import { can, moduleLabel } from "@/lib/roles";

/**
 * Operational home for the capture profiles.
 *
 * One page, two readings of it: a Technician on hospital wiring cares about
 * transmission status, while a Point of Care Operator working out of a vehicle
 * cares about what is still held locally. That difference is driven by the
 * `syncQueue` capability rather than by a second page, so editing the preset in
 * Settings changes this screen too.
 */

type Row = {
  id: string;
  patient: string;
  exam: string;
  unit: string;
  state: "to-capture" | "captured" | "sending" | "sent" | "failed" | "queued";
  note?: string;
};

const rows: Row[] = [
  { id: "ECG-2461", patient: "Marta Ferreira", exam: "Resting ECG", unit: "Room 302", state: "to-capture" },
  { id: "ECG-2462", patient: "Bruno Salles", exam: "Holter 24h", unit: "Ward B", state: "to-capture" },
  { id: "ECG-2463", patient: "Ana Beatriz Lima", exam: "Stress Test", unit: "Room 118", state: "captured" },
  { id: "ECG-2464", patient: "Cristiano Montanari", exam: "Resting ECG", unit: "Room 302", state: "sending" },
  { id: "ECG-2465", patient: "Laura Lombardi", exam: "ABPM", unit: "Ambulatory", state: "failed", note: "Lead V4 detached" },
  { id: "ECG-2466", patient: "Paulo Ventura", exam: "Resting ECG", unit: "Mobile unit 2", state: "queued", note: "Waiting for connectivity" },
  { id: "ECG-2467", patient: "Helena Costa", exam: "Resting ECG", unit: "Room 210", state: "sent" },
  { id: "ECG-2468", patient: "Rafael Nunes", exam: "Holter 24h", unit: "Home visit", state: "sent" },
];

const stateLabel: Record<
  Row["state"],
  { label: string; variant: "default" | "secondary" | "success" | "destructive" | "neutral" }
> = {
  "to-capture": { label: "To capture", variant: "default" },
  captured: { label: "Captured", variant: "secondary" },
  sending: { label: "Sending", variant: "secondary" },
  sent: { label: "Sent", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  queued: { label: "Queued", variant: "neutral" },
};

export function CaptureHome() {
  const { role } = useSession();
  const offlineFirst = can(role, "syncQueue");
  const [toast, setToast] = React.useState<string | null>(null);

  const counts = {
    toCapture: rows.filter((r) => r.state === "to-capture").length,
    toSend: rows.filter((r) => r.state === "captured" || r.state === "queued").length,
    failed: rows.filter((r) => r.state === "failed").length,
    sent: rows.filter((r) => r.state === "sent").length,
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {moduleLabel(role, "capture")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {offlineFirst
              ? "Capture anywhere. Exams upload themselves once you are back online."
              : "Everything waiting to be captured, sent and confirmed."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setToast("New exam started in this prototype.")}>
            <Plus />
            New Exam
          </Button>
          {offlineFirst ? (
            <Button variant="outline" onClick={() => setToast("Sync started.")}>
              <RefreshCw />
              Sync
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setToast("Queued exams sent.")}>
              <Send />
              Send Exam
            </Button>
          )}
          {can(role, "retrySend") && (
            <Button variant="secondary" onClick={() => setToast("Retrying failed transmissions.")}>
              <RefreshCw />
              Retry
            </Button>
          )}
        </div>
      </header>

      {/* Connectivity leads for the field profile only. */}
      {offlineFirst && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Wifi className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Connected · 4G</p>
                <p className="text-xs text-muted-foreground">
                  Last sync 3 min ago · {counts.toSend} exam(s) still queued
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setToast("Sync started.")}>
              <RefreshCw />
              Sync now
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="To capture" value={counts.toCapture} hint="Scheduled and waiting" icon={Plus} />
        <Metric
          label={offlineFirst ? "Waiting to upload" : "Waiting to send"}
          value={counts.toSend}
          hint={offlineFirst ? "Held on this device" : "Captured, not transmitted"}
          icon={offlineFirst ? CloudOff : Send}
        />
        <Metric label="Failed" value={counts.failed} hint="Needs your attention" icon={AlertTriangle} tone="danger" />
        <Metric label="Confirmed" value={counts.sent} hint="Received by the archive" icon={CheckCircle2} tone="success" />
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-foreground">Today&apos;s worklist</h2>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th>Patient</th>
                  <th className="w-[150px]">Exam</th>
                  <th className="w-[140px]">Unit</th>
                  <th className="w-[220px]">Status</th>
                  <th className="w-[110px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => {
                  const badge = stateLabel[row.state];
                  return (
                    <tr key={row.id} className="transition-colors hover:bg-muted/70">
                      <td className="font-medium text-foreground">{row.patient}</td>
                      <td className="text-muted-foreground">{row.exam}</td>
                      <td className="text-muted-foreground">{row.unit}</td>
                      <td>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                        {row.note && (
                          <span className="ml-2 text-xs text-muted-foreground">{row.note}</span>
                        )}
                      </td>
                      <td className="text-right">
                        <Button
                          size="sm"
                          variant={row.state === "failed" ? "default" : "outline"}
                          onClick={() =>
                            setToast(
                              row.state === "to-capture"
                                ? `Capture started for ${row.patient}.`
                                : row.state === "failed"
                                  ? `Retrying ${row.id}.`
                                  : `${row.id} opened.`,
                            )
                          }
                        >
                          {row.state === "to-capture"
                            ? "Capture"
                            : row.state === "failed"
                              ? "Retry"
                              : row.state === "captured" || row.state === "queued"
                                ? offlineFirst
                                  ? "Sync"
                                  : "Send"
                                : "Open"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "danger" | "success";
}) {
  return (
    <Card className={cn(tone === "danger" && value > 0 && "border-destructive/30 bg-destructive/5")}>
      <CardContent className="py-5">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <Icon
            className={cn(
              "h-6 w-6",
              tone === "danger"
                ? "text-destructive"
                : tone === "success"
                  ? "text-green-600"
                  : "text-primary",
            )}
          />
        </div>
        <p className="mt-2 font-heading text-3xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
