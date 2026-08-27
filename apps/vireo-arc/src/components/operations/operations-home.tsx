"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Gauge,
  ShieldQuestion,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge, Button, Card, CardContent, cn } from "@cardioline/ui";
import { useSession } from "@/lib/session";
import { can } from "@/lib/roles";

/**
 * Operations home for the Department Manager: the state of the operation, not
 * the content of any one exam.
 *
 * Everything here is aggregate on purpose. Opening an individual patient's
 * clinical data is gated behind the `viewClinicalContent` capability, which is
 * off by default because whether an operational manager may do so is an
 * unresolved compliance question — see `roles.ts`.
 */

const sla = [
  { unit: "Emergency department", volume: 148, within: 92, median: "34 min" },
  { unit: "Cardiology ward", volume: 96, within: 88, median: "51 min" },
  { unit: "Ambulatory", volume: 212, within: 74, median: "1 h 48 min" },
  { unit: "Point of care network", volume: 64, within: 61, median: "2 h 12 min" },
];

const team = [
  { name: "Dr. Sarah Jenkins", role: "Reviewing Physician", output: "38 reports", trend: "+6%" },
  { name: "Dr. Lucas Martin", role: "Overreading Physician", output: "51 reports", trend: "+11%" },
  { name: "Carlos Almeida", role: "Technician", output: "74 captures", trend: "−3%" },
  { name: "Chiara Mancini", role: "Point of Care Operator", output: "29 captures", trend: "+18%" },
];

const weeks = [62, 71, 68, 84, 79, 93];

export function OperationsHome() {
  const { role } = useSession();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Operations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Volume, turnaround and team performance across your group.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {can(role, "manageUsers") && (
            <Button asChild variant="outline">
              <Link href="/settings/admin/users">
                <Users />
                Manage Users
              </Link>
            </Button>
          )}
          {can(role, "manageSla") && (
            <Button asChild variant="outline">
              <Link href="/settings/system">
                <Gauge />
                Configure SLA
              </Link>
            </Button>
          )}
          {can(role, "manageUsers") && (
            <Button asChild>
              <Link href="/settings/admin/roles">
                Configure Roles
                <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Exams this week" value="520" hint="+9% vs last week" icon={TrendingUp} />
        <Metric label="Pending report" value="63" hint="Across all units" icon={Clock} />
        <Metric label="Median time to report" value="58 min" hint="Target 60 min" icon={Gauge} tone="success" />
        <Metric label="Outside SLA" value="21" hint="Requires escalation" icon={AlertTriangle} tone="danger" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-heading text-lg font-bold text-foreground">SLA by unit</h2>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th>Unit</th>
                    <th className="w-[90px]">Volume</th>
                    <th className="w-[150px]">Within SLA</th>
                    <th className="w-[110px]">Median</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sla.map((row) => (
                    <tr key={row.unit} className="transition-colors hover:bg-muted/70">
                      <td className="font-medium text-foreground">{row.unit}</td>
                      <td className="text-muted-foreground">{row.volume}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <span
                              className={cn(
                                "block h-full rounded-full",
                                row.within >= 85 ? "bg-green-600" : row.within >= 70 ? "bg-amber-500" : "bg-destructive",
                              )}
                              style={{ width: `${row.within}%` }}
                            />
                          </span>
                          <span className="text-xs font-semibold text-foreground">{row.within}%</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground">{row.median}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-heading text-lg font-bold text-foreground">Weekly volume</h2>
          </div>
          <CardContent className="py-6">
            {/* Each column is `h-full` so the bar's percentage height has a
                resolved parent to measure against — without it the bars
                collapse to nothing. */}
            <div className="flex h-40 gap-3">
              {weeks.map((value, index) => (
                <div key={index} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <div
                    className="w-full rounded-t bg-primary"
                    style={{ height: `${(value / Math.max(...weeks)) * 100}%` }}
                  />
                  <span className="text-center text-[11px] text-muted-foreground">
                    W{40 + index}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-foreground">Team output</h2>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th>Member</th>
                  <th className="w-[220px]">Role</th>
                  <th className="w-[140px]">This week</th>
                  <th className="w-[100px]">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {team.map((member) => (
                  <tr key={member.name} className="transition-colors hover:bg-muted/70">
                    <td className="font-medium text-foreground">{member.name}</td>
                    <td className="text-muted-foreground">{member.role}</td>
                    <td className="text-muted-foreground">{member.output}</td>
                    <td>
                      <Badge variant={member.trend.startsWith("+") ? "success" : "neutral"}>
                        {member.trend}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* States the boundary rather than hiding it, so the open compliance
          question is visible to whoever configures this role. */}
      {!can(role, "viewClinicalContent") && (
        <Card className="border-dashed">
          <CardContent className="flex items-start gap-3 py-5">
            <ShieldQuestion className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Aggregated figures only
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                This profile does not open individual patient clinical data. Whether
                an operational manager should is an unresolved compliance question,
                so it stays a deliberate grant — an administrator can enable{" "}
                <span className="font-medium text-foreground">Identified clinical content</span>{" "}
                on this role.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
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
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "danger" | "success";
}) {
  return (
    <Card className={cn(tone === "danger" && "border-destructive/30 bg-destructive/5")}>
      <CardContent className="py-5">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <Icon
            className={cn(
              "h-6 w-6",
              tone === "danger" ? "text-destructive" : tone === "success" ? "text-green-600" : "text-primary",
            )}
          />
        </div>
        <p className="mt-2 font-heading text-3xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
