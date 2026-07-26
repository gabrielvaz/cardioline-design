"use client";

import * as React from "react";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  Activity,
  AlertTriangle,
  FileText,
  Inbox,
  MonitorCog,
  Users,
} from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, cn } from "@cardioline/ui";
import { dashboardWeeklyPerformance } from "@/lib/mock-data";
import { usePrototypeData, type InboxExam, type Report } from "@/lib/prototype-data";

function useEnterAnimation() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return mounted;
}

type MetricCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
  tone?: "default" | "critical";
};

function MetricCard({ title, value, detail, icon: Icon, href, tone = "default" }: MetricCardProps) {
  const content = (
    <Card
      className={
        tone === "critical"
          ? "h-full border-destructive/25 bg-destructive/5 transition-colors hover:bg-destructive/10"
          : "h-full transition-colors hover:bg-muted/50"
      }
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={tone === "critical" ? "text-sm font-medium text-destructive" : "text-sm font-medium text-muted-foreground"}>
          {title}
        </CardTitle>
        <Icon className={tone === "critical" ? "h-4 w-4 text-destructive" : "h-4 w-4 text-primary"} />
      </CardHeader>
      <CardContent>
        <div className={tone === "critical" ? "text-2xl font-bold text-destructive" : "text-2xl font-bold text-foreground"}>{value}</div>
        <p className={tone === "critical" ? "mt-1 text-xs font-medium text-destructive/90" : "mt-1 text-xs text-muted-foreground"}>{detail}</p>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" href={href}>
      {content}
    </Link>
  ) : (
    content
  );
}

function QueueItem({ exam }: { exam: InboxExam }) {
  const priority = exam.emergency ? "Emergency" : exam.pediatric ? "Pediatric" : "Waiting";
  return (
    <Link
      href={`/exams/${exam.id}`}
      className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors hover:bg-muted/60 focus-visible:bg-muted focus-visible:outline-none"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{exam.patient}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{exam.type} · {exam.unit}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={exam.emergency ? "destructive" : exam.pediatric ? "warning" : "secondary"}>{priority}</Badge>
        <span className="hidden text-xs text-muted-foreground sm:inline">{exam.received}</span>
      </div>
    </Link>
  );
}

function RecentReportItem({ report }: { report: Report }) {
  const pending = report.status === "Pending Review" || report.status === "Draft";
  return (
    <Link
      href={`/reports/${report.id}`}
      className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors hover:bg-muted/60 focus-visible:bg-muted focus-visible:outline-none"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{report.patient}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{report.type} · {report.date}</p>
      </div>
      <Badge variant={pending ? "warning" : "success"} className="shrink-0">{report.status}</Badge>
    </Link>
  );
}

function DeviceStatus() {
  const devices = [
    { name: "Cardioline ECG100L", location: "Room 302", status: "Online", battery: "85%" },
    { name: "Cardioline Walk400h", location: "Ward B", status: "In use", battery: "42%" },
    { name: "Cardioline ECG200+", location: "ER", status: "Offline", battery: "0%" },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><MonitorCog className="h-5 w-5 text-primary" />Device status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {devices.map((device) => (
          <div key={device.name} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{device.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">Location: {device.location}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className={device.status === "Online" ? "flex items-center justify-end gap-1.5 text-sm font-medium text-emerald-600" : device.status === "In use" ? "flex items-center justify-end gap-1.5 text-sm font-medium text-primary" : "flex items-center justify-end gap-1.5 text-sm font-medium text-muted-foreground"}>
                <span className={device.status === "Online" ? "h-2 w-2 rounded-full bg-emerald-500" : device.status === "In use" ? "h-2 w-2 rounded-full bg-primary" : "h-2 w-2 rounded-full bg-muted-foreground"} />
                {device.status}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Battery: {device.battery}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function WeeklyVolumeChart() {
  const peak = Math.max(...dashboardWeeklyPerformance.map((week) => week.exams));
  const mounted = useEnterAnimation();
  const [hovered, setHovered] = React.useState<string | null>(null);
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-lg">Weekly clinical volume</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Created exams and completed reports</p>
        </div>
        <div className="flex shrink-0 gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary" />Exams</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary/35" />Reports</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid h-52 grid-cols-6 items-end gap-3 border-b border-border pt-3 sm:gap-5">
          {dashboardWeeklyPerformance.map((week, index) => {
            const examHeight = Math.max(16, Math.round((week.exams / peak) * 100));
            const reportHeight = Math.round((week.reports / week.exams) * examHeight);
            const isHovered = hovered === week.week;
            return (
              <div
                key={week.week}
                className="relative flex h-full min-w-0 flex-col justify-end"
                onMouseEnter={() => setHovered(week.week)}
                onMouseLeave={() => setHovered(null)}
              >
                {isHovered && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg animate-in fade-in duration-200 ease-out">
                    <p className="font-semibold text-foreground">{week.week}</p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-muted-foreground"><span className="h-1.5 w-1.5 rounded-sm bg-primary" />{week.exams} exams</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-muted-foreground"><span className="h-1.5 w-1.5 rounded-sm bg-primary/35" />{week.reports} reports</p>
                  </div>
                )}
                <div className="relative flex flex-1 items-end justify-center">
                  <div
                    className={cn(
                      "relative flex h-full w-full max-w-12 items-end overflow-hidden rounded-t-md bg-muted/70 transition-opacity duration-300 ease-out",
                      isHovered && "opacity-80",
                    )}
                  >
                    <span
                      className="w-full bg-primary transition-[height] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        height: mounted ? `${examHeight}%` : "0%",
                        transitionDelay: `${index * 45}ms`,
                      }}
                    />
                    <span
                      className="absolute bottom-0 w-full bg-primary/35 transition-[height] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        height: mounted ? `${reportHeight}%` : "0%",
                        transitionDelay: `${index * 45 + 100}ms`,
                      }}
                    />
                  </div>
                </div>
                <p
                  className={cn(
                    "mt-2 text-center text-xs font-medium transition-colors duration-200",
                    isHovered ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {week.week}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function MedianReportTimeChart() {
  const values = dashboardWeeklyPerformance.map((week) => week.medianMinutesToReport);
  const high = Math.max(...values);
  const low = Math.min(...values);
  const width = 480;
  const height = 126;
  const coords = values.map((value, index) => ({
    x: (index / (values.length - 1)) * width,
    y: 12 + ((high - value) / Math.max(1, high - low)) * (height - 32),
  }));
  const points = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const mounted = useEnterAnimation();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const hoveredWeek = hoveredIndex !== null ? dashboardWeeklyPerformance[hoveredIndex] : null;
  const hoveredCoord = hoveredIndex !== null ? coords[hoveredIndex] : null;
  const priorValue = hoveredIndex !== null && hoveredIndex > 0 ? values[hoveredIndex - 1] : null;
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-lg">Median time to report</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">From exam arrival to finalized report</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{values.at(-1)} min</p>
          <p className="mt-1 text-xs font-medium text-emerald-600">−{values[0] - values.at(-1)!} min in 6 weeks</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="relative">
            <svg className="w-full overflow-visible" style={{ aspectRatio: `${width} / ${height}` }} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Median time to report by week">
              <path d={`M0 ${height - 10} H${width}`} className="stroke-border" strokeWidth="1" fill="none" />
              <polyline
                points={points}
                fill="none"
                className="stroke-primary transition-[stroke-dashoffset] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={100}
                style={{ strokeDasharray: 100, strokeDashoffset: mounted ? 0 : 100 }}
              />
              {coords.map((point, index) => {
                const isHovered = hoveredIndex === index;
                return (
                  <circle
                    key={dashboardWeeklyPerformance[index].week}
                    cx={point.x}
                    cy={point.y}
                    r={isHovered ? 6 : 4}
                    className="cursor-pointer fill-card stroke-primary transition-[r,opacity] duration-300 ease-out"
                    strokeWidth="2"
                    style={{
                      opacity: mounted ? 1 : 0,
                      transitionDelay: mounted ? "0ms" : `${400 + index * 90}ms`,
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>
            {hoveredWeek && hoveredCoord && (
              <div
                className="pointer-events-none absolute z-10 w-max -translate-x-1/2 -translate-y-full rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg animate-in fade-in duration-200 ease-out"
                style={{
                  left: `${(hoveredCoord.x / width) * 100}%`,
                  top: `${(hoveredCoord.y / height) * 100}%`,
                  marginTop: "-10px",
                }}
              >
                <p className="font-semibold text-foreground">{hoveredWeek.week}</p>
                <p className="mt-1 text-muted-foreground">{hoveredWeek.medianMinutesToReport} min to report</p>
                {priorValue !== null && (
                  <p className={priorValue - hoveredWeek.medianMinutesToReport >= 0 ? "text-emerald-600" : "text-destructive"}>
                    {priorValue - hoveredWeek.medianMinutesToReport >= 0 ? "−" : "+"}
                    {Math.abs(priorValue - hoveredWeek.medianMinutesToReport)} min vs prior week
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-6 text-center text-xs font-medium text-muted-foreground">
            {dashboardWeeklyPerformance.map((week, index) => (
              <span key={week.week} className={cn("transition-colors", hoveredIndex === index && "text-foreground")}>
                {week.week}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const { data } = usePrototypeData();
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Exam inbox" value={String(data.inbox.length)} detail="Awaiting your report" icon={Inbox} href="/exam-inbox" />
        <MetricCard title="Total exams (today)" value={String(data.exams.length)} detail="Across all units" icon={Activity} href="/exams" />
        <MetricCard title="New patients" value={String(data.patients.length)} detail="Registered in the prototype" icon={Users} href="/patients" />
        <MetricCard title="Critical alerts" value="3" detail="Requires immediate attention" icon={AlertTriangle} href="/exam-inbox" tone="critical" />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-lg"><Inbox className="h-5 w-5 text-primary" />Exam inbox</CardTitle>
            <Link href="/exam-inbox" className="text-sm font-medium text-primary hover:underline">View inbox</Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {data.inbox.slice(0, 4).map((exam) => <QueueItem key={exam.id} exam={exam} />)}
            {!data.inbox.length && (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">Your inbox is clear.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5 text-primary" />Recent reports</CardTitle>
              <Link href="/reports" className="text-sm font-medium text-primary hover:underline">View reports</Link>
            </CardHeader>
            <CardContent className="space-y-1">
              {data.reports.slice(0, 3).map((report) => <RecentReportItem key={report.id} report={report} />)}
              {!data.reports.length && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">No reports generated yet.</p>
              )}
            </CardContent>
          </Card>
          <DeviceStatus />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <WeeklyVolumeChart />
        <MedianReportTimeChart />
      </div>
    </>
  );
}
