"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpDown,
  Baby,
  Clock3,
  Grid2X2,
  LayoutList,
  Search,
  Settings2,
  Stethoscope,
  TableProperties,
  UserRound,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@cardioline/ui";
import { inboxExams } from "@/lib/mock-data";

type ViewMode = "cards" | "table";
type SortMode = "priority" | "waiting" | "recent" | "patient";
type Criterion = "emergency" | "pediatric" | "elderly" | "waiting";
type InboxExam = (typeof inboxExams)[number];

const criteria: { id: Criterion; label: string; description: string }[] = [
  {
    id: "emergency",
    label: "Emergency status",
    description: "Moves urgent cases to the front",
  },
  {
    id: "pediatric",
    label: "Pediatric patient",
    description: "Prioritizes patients under 18",
  },
  {
    id: "elderly",
    label: "Older patient",
    description: "Prioritizes patients aged 65+",
  },
  {
    id: "waiting",
    label: "Waiting time",
    description: "Increases priority as time passes",
  },
];

export function ExamInbox() {
  const [view, setView] = React.useState<ViewMode>("cards");
  const [sort, setSort] = React.useState<SortMode>("priority");
  const [query, setQuery] = React.useState("");
  const [activeCriteria, setActiveCriteria] = React.useState<Criterion[]>([
    "emergency",
    "pediatric",
    "elderly",
    "waiting",
  ]);

  const toggleCriterion = (criterion: Criterion) =>
    setActiveCriteria((current) =>
      current.includes(criterion)
        ? current.filter((item) => item !== criterion)
        : [...current, criterion],
    );
  const priorityScore = React.useCallback(
    (exam: InboxExam) => {
      let score = 0;
      if (activeCriteria.includes("emergency") && exam.emergency) score += 90;
      if (activeCriteria.includes("pediatric") && exam.pediatric) score += 45;
      if (activeCriteria.includes("elderly") && exam.age >= 65) score += 30;
      if (activeCriteria.includes("waiting"))
        score += Math.min(35, Math.floor(exam.waitingMinutes / 12));
      return score;
    },
    [activeCriteria],
  );

  const exams = React.useMemo(
    () =>
      inboxExams
        .filter((exam) =>
          `${exam.patient} ${exam.patientId} ${exam.type} ${exam.unit}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .sort((a, b) => {
          if (sort === "priority")
            return (
              priorityScore(b) - priorityScore(a) ||
              b.waitingMinutes - a.waitingMinutes
            );
          if (sort === "waiting") return b.waitingMinutes - a.waitingMinutes;
          if (sort === "recent") return a.waitingMinutes - b.waitingMinutes;
          return a.patient.localeCompare(b.patient);
        }),
    [priorityScore, query, sort],
  );

  const urgentCount = exams.filter((exam) => priorityScore(exam) >= 70).length;
  const averageWait = exams.length
    ? Math.round(
        exams.reduce((total, exam) => total + exam.waitingMinutes, 0) /
          exams.length,
      )
    : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Stethoscope className="h-4 w-4 text-[#ee5b00]" />
            My reporting worklist
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#071046]">
            Exam Inbox
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Exams assigned to you, ranked by clinical priority and waiting time.
          </p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white text-center shadow-sm">
          <Metric label="Awaiting report" value={String(exams.length)} />
          <Metric label="Urgent now" value={String(urgentCount)} alert />
          <Metric label="Avg. wait" value={formatMinutes(averageWait)} />
        </div>
      </header>

      <section className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patient, ID, exam or unit..."
              className="h-10 border-gray-200 bg-gray-50 pl-9"
            />
          </div>
          <Select
            value={sort}
            onValueChange={(value) => setSort(value as SortMode)}
          >
            <SelectTrigger className="h-10 min-w-[200px]">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Clinical priority</SelectItem>
              <SelectItem value="waiting">Longest waiting</SelectItem>
              <SelectItem value="recent">Most recently received</SelectItem>
              <SelectItem value="patient">Patient name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <PrioritySettings
            activeCriteria={activeCriteria}
            onToggle={toggleCriterion}
          />
          <ViewSettings view={view} onViewChange={setView} />
        </div>
      </section>

      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{exams.length}</span>{" "}
          exams in your worklist
        </p>
        <p className="hidden text-xs text-gray-400 md:block">
          Priority updates from your selected clinical criteria.
        </p>
      </div>
      {view === "cards" ? (
        <CardGrid exams={exams} score={priorityScore} />
      ) : (
        <InboxTable exams={exams} score={priorityScore} />
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="min-w-[112px] px-4 py-3">
      <p
        className={cn(
          "text-lg font-bold",
          alert ? "text-red-600" : "text-gray-900",
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-medium text-gray-500">{label}</p>
    </div>
  );
}

function PrioritySettings({
  activeCriteria,
  onToggle,
}: {
  activeCriteria: Criterion[];
  onToggle: (criterion: Criterion) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 border-gray-200">
          <Settings2 className="mr-2" />
          Priority rules{" "}
          <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[11px]">
            {activeCriteria.length}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2">
        <DropdownMenuLabel>Clinical priority criteria</DropdownMenuLabel>
        <p className="px-3 pb-2 text-xs leading-5 text-muted-foreground">
          These rules compose the default urgency score for your inbox.
        </p>
        <DropdownMenuSeparator />
        {criteria.map((criterion) => (
          <label
            key={criterion.id}
            className="flex cursor-pointer items-start gap-3 rounded-md px-3 py-3 transition-colors hover:bg-muted"
          >
            <Checkbox
              checked={activeCriteria.includes(criterion.id)}
              onCheckedChange={() => onToggle(criterion.id)}
            />
            <span>
              <span className="block text-sm font-medium text-foreground">
                {criterion.label}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {criterion.description}
              </span>
            </span>
          </label>
        ))}
        <DropdownMenuSeparator />
        <p className="px-3 py-2 text-xs text-muted-foreground">
          The selected rules are applied immediately.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ViewSettings({
  view,
  onViewChange,
}: {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          aria-label="Change inbox view"
          title="Change inbox view"
          className="h-10 w-10 border-gray-200"
        >
          {view === "cards" ? <Grid2X2 /> : <TableProperties />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>View type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onViewChange("cards")}>
          <Grid2X2 className={view === "cards" ? "text-primary" : ""} />
          Cards{" "}
          {view === "cards" && (
            <span className="ml-auto text-xs text-primary">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onViewChange("table")}>
          <LayoutList className={view === "table" ? "text-primary" : ""} />
          Table{" "}
          {view === "table" && (
            <span className="ml-auto text-xs text-primary">Active</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CardGrid({
  exams,
  score,
}: {
  exams: InboxExam[];
  score: (exam: InboxExam) => number;
}) {
  if (!exams.length) return <EmptyState />;
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {exams.map((exam, index) => (
        <InboxCard
          key={exam.id}
          exam={exam}
          score={score(exam)}
          index={index}
        />
      ))}
    </div>
  );
}

function InboxCard({
  exam,
  score,
  index,
}: {
  exam: InboxExam;
  score: number;
  index: number;
}) {
  const reasons = priorityReasons(exam);
  const urgent = score >= 70;
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md",
        urgent && "border-red-200",
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          urgent
            ? "bg-red-500"
            : score >= 40
              ? "bg-orange-400"
              : "bg-slate-300",
        )}
      />
      <CardContent className="p-5 pl-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <PriorityPill score={score} />
              <span className="text-xs text-gray-400">
                #{index + 1} in queue
              </span>
            </div>
            <h2
              title={exam.patient}
              className="mt-3 truncate text-lg font-semibold text-gray-900"
            >
              {exam.patient}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {exam.patientId} · {exam.age} years
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
            {exam.patient
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </div>
        </div>
        <div className="mt-5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-gray-900">{exam.type}</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
              <Clock3 className="h-3.5 w-3.5" />
              {exam.received}
            </span>
          </div>
          <p title={exam.unit} className="mt-1 truncate text-xs text-gray-500">
            {exam.unit}
          </p>
        </div>
        <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">
          {exam.note}
        </p>
        <div className="mt-4 flex min-h-6 flex-wrap gap-1.5">
          {reasons.map((reason) => (
            <PriorityReason key={reason} reason={reason} />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-xs text-gray-500">
            Waiting{" "}
            <span className="font-semibold text-gray-700">
              {formatMinutes(exam.waitingMinutes)}
            </span>
          </span>
          <Button asChild size="sm" className="bg-primary text-white">
            <Link href={`/exams/${exam.id}`}>Start report</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InboxTable({
  exams,
  score,
}: {
  exams: InboxExam[];
  score: (exam: InboxExam) => number;
}) {
  if (!exams.length) return <EmptyState />;
  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Patient</th>
                <th className="px-5 py-4">Exam</th>
                <th className="px-5 py-4">Received</th>
                <th className="px-5 py-4">Priority factors</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exams.map((exam) => (
                <tr
                  key={exam.id}
                  className="transition-colors hover:bg-orange-50/70"
                >
                  <td className="px-5 py-4">
                    <PriorityPill score={score(exam)} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">
                      {exam.patient}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {exam.patientId} · {exam.age} years
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">{exam.type}</div>
                    <div className="mt-0.5 max-w-48 truncate text-xs text-gray-500">
                      {exam.unit}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    <div>{exam.received}</div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      Waiting {formatMinutes(exam.waitingMinutes)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex max-w-64 flex-wrap gap-1.5">
                      {priorityReasons(exam).map((reason) => (
                        <PriorityReason key={reason} reason={reason} />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/exams/${exam.id}`}>Report</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function PriorityPill({ score }: { score: number }) {
  const urgent = score >= 70;
  const elevated = score >= 40;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        urgent
          ? "bg-red-100 text-red-700"
          : elevated
            ? "bg-orange-100 text-orange-700"
            : "bg-gray-100 text-gray-700",
      )}
    >
      {urgent ? (
        <AlertTriangle className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5" />
      )}
      {urgent ? "Urgent" : elevated ? "Elevated" : "Routine"}
    </span>
  );
}

function PriorityReason({ reason }: { reason: string }) {
  const Icon =
    reason === "Emergency"
      ? AlertTriangle
      : reason === "Pediatric"
        ? Baby
        : reason === "Older patient"
          ? UserRound
          : Clock3;
  const style =
    reason === "Emergency"
      ? "border-red-100 bg-red-50 text-red-700"
      : reason === "Pediatric"
        ? "border-orange-100 bg-orange-50 text-orange-700"
        : "border-gray-200 bg-gray-50 text-gray-600";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium",
        style,
      )}
    >
      <Icon className="h-3 w-3" />
      {reason}
    </span>
  );
}

function priorityReasons(exam: InboxExam) {
  const reasons = [];
  if (exam.emergency) reasons.push("Emergency");
  if (exam.pediatric) reasons.push("Pediatric");
  if (exam.age >= 65) reasons.push("Older patient");
  if (exam.waitingMinutes >= 120) reasons.push("Long wait");
  return reasons.length ? reasons : ["Standard queue"];
}
function formatMinutes(minutes: number) {
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}h ${minutes % 60 ? `${minutes % 60}m` : ""}`.trim()
    : `${minutes}m`;
}
function EmptyState() {
  return (
    <Card className="border-dashed border-gray-300 bg-white">
      <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
          <Stethoscope />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Your inbox is clear
        </h2>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          No assigned exams match this search. New exams will appear here as
          they are received.
        </p>
      </CardContent>
    </Card>
  );
}
