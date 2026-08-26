"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpDown,
  Baby,
  Clock3,
  Search,
  SlidersHorizontal,
  Stethoscope,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableToolbarMenu,
  type TableDensity,
  cn,
} from "@cardioline/ui";
import { PrototypeToast } from "@/components/ui/prototype-toast";
import { useGlobalTableDensity } from "@/components/ui/use-global-table-density";
import { PageHeader } from "@/components/ui/page-header";
import { AssignmentDialog } from "@/components/exams/assignment-dialog";
import { usePrototypeData, type InboxExam } from "@/lib/prototype-data";

type ViewMode = "cards" | "table";
type SortMode = "priority" | "waiting" | "recent" | "patient";
type Criterion = "emergency" | "pediatric" | "elderly" | "waiting";

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

const inboxTableColumns = [
  { id: "priority", label: "Priority" },
  { id: "patient", label: "Patient", locked: true },
  { id: "exam", label: "Exam" },
  { id: "received", label: "Received" },
  { id: "factors", label: "Priority factors" },
  { id: "actions", label: "Actions", locked: true },
];

export function ExamInbox() {
  const { data, assignInboxExam } = usePrototypeData();
  const [view, setView] = React.useState<ViewMode>("cards");
  const [sort, setSort] = React.useState<SortMode>("priority");
  const [query, setQuery] = React.useState("");
  const [criteriaOpen, setCriteriaOpen] = React.useState(false);
  const [density, setDensity] = useGlobalTableDensity();
  const [visibleColumns, setVisibleColumns] = React.useState(
    inboxTableColumns.map((column) => column.id),
  );
  const [activeCriteria, setActiveCriteria] = React.useState<Criterion[]>([
    "emergency",
    "pediatric",
    "elderly",
    "waiting",
  ]);
  const [assignmentExam, setAssignmentExam] = React.useState<InboxExam | null>(
    null,
  );
  const [toast, setToast] = React.useState<string | null>(null);
  /* Which card carries the expanded treatment.  `null` means "whatever is at
     the top of the queue", so the emphasis follows re-ranking until the reader
     picks a case themselves. */
  const [focusedExam, setFocusedExam] = React.useState<string | null>(null);

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
      data.inbox
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
    [data.inbox, priorityScore, query, sort],
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
      <PageHeader
        title="Exam Inbox"
        description="Exams assigned to you, ranked by clinical priority and waiting time."
        actions={<div className="grid grid-cols-3 divide-x divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white text-center shadow-sm">
          <Metric label="Awaiting report" value={String(exams.length)} />
          <Metric label="Urgent now" value={String(urgentCount)} alert />
          <Metric label="Avg. wait" value={formatMinutes(averageWait)} />
        </div>}
      />

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[310px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patient, ID, exam or unit..."
              className="h-10 border-gray-200 bg-white pl-9"
            />
          </div>
          <Select
            value={sort}
            onValueChange={(value) => setSort(value as SortMode)}
          >
            <SelectTrigger className="h-10 min-w-[190px]">
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
          <Button
            variant="outline"
            onClick={() => setCriteriaOpen(true)}
            className="h-10 border-gray-200"
          >
            <SlidersHorizontal className="mr-2" />
            Priority criteria
            {/* The ranking is only trustworthy if the reader can see, without
                opening the dialog, that it is not running on all criteria. */}
            {activeCriteria.length < criteria.length && (
              <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
                {activeCriteria.length}/{criteria.length}
              </span>
            )}
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 self-end sm:self-auto">
          <TableToolbarMenu
            columns={inboxTableColumns}
            visibleColumns={visibleColumns}
            onVisibleColumnsChange={setVisibleColumns}
            density={density}
            onDensityChange={setDensity}
            view={{ value: view, onValueChange: setView }}
          />
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
        <CardGrid
          exams={exams}
          score={priorityScore}
          onAssign={setAssignmentExam}
          focusedExam={focusedExam}
          onFocusExam={setFocusedExam}
        />
      ) : (
        <InboxTable
          exams={exams}
          score={priorityScore}
          density={density}
          visibleColumns={visibleColumns}
          onAssign={setAssignmentExam}
        />
      )}
      <PriorityCriteriaDialog
        open={criteriaOpen}
        onOpenChange={setCriteriaOpen}
        activeCriteria={activeCriteria}
        onToggle={toggleCriterion}
        onReset={() => setActiveCriteria(criteria.map((item) => item.id))}
      />
      <AssignmentDialog
        exam={assignmentExam}
        onOpenChange={(open) => !open && setAssignmentExam(null)}
        onAssign={(professional) => {
          if (assignmentExam) assignInboxExam(assignmentExam.id, professional);
          setToast(`${assignmentExam?.id} assigned to ${professional}.`);
          setAssignmentExam(null);
        }}
      />
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

/**
 * Sort-order settings for the inbox.  The criteria used to sit permanently
 * expanded above the worklist; they are configuration, not clinical content,
 * so they live behind a dialog and give the worklist back its vertical space.
 */
function PriorityCriteriaDialog({
  open,
  onOpenChange,
  activeCriteria,
  onToggle,
  onReset,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeCriteria: Criterion[];
  onToggle: (criterion: Criterion) => void;
  onReset: () => void;
}) {
  const allActive = activeCriteria.length === criteria.length;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-labelledby="priority-criteria-title">
        <DialogHeader>
          <DialogTitle id="priority-criteria-title">
            Ranking criteria
          </DialogTitle>
          <DialogDescription>
            These rules compose the urgency score that orders your inbox.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          {criteria.map((criterion) => (
            <label
              key={criterion.id}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-gray-100 px-3 py-3 transition-colors hover:bg-muted"
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
        </div>

        {/* Turning a criterion off silently demotes those cases in the queue,
            so the consequence is stated where the choice is made. */}
        {!allActive && (
          <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Disabled criteria no longer raise a case in the queue. Exams that
            depend on them will rank lower than they otherwise would.
          </p>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={onReset} disabled={allActive}>
            Reset to all criteria
          </Button>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

function CardGrid({
  exams,
  score,
  onAssign,
  focusedExam,
  onFocusExam,
}: {
  exams: InboxExam[];
  score: (exam: InboxExam) => number;
  onAssign: (exam: InboxExam) => void;
  focusedExam: string | null;
  onFocusExam: (id: string) => void;
}) {
  if (!exams.length) return <EmptyState />;
  /* Until the reader picks a case, the expanded treatment stays on whatever
     the ranking put first. */
  const featuredId = focusedExam ?? exams[0].id;
  return (
    <div className="grid gap-4">
      {exams.map((exam, index) => (
        <InboxCard
          key={exam.id}
          exam={exam}
          score={score(exam)}
          index={index}
          onAssign={onAssign}
          featured={exam.id === featuredId}
          onFocus={() => onFocusExam(exam.id)}
        />
      ))}
    </div>
  );
}

function InboxCard({
  exam,
  score,
  index,
  onAssign,
  featured,
  onFocus,
}: {
  exam: InboxExam;
  score: number;
  index: number;
  onAssign: (exam: InboxExam) => void;
  featured: boolean;
  onFocus: () => void;
}) {
  const reasons = priorityReasons(exam);
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={featured}
      onClick={onFocus}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onFocus();
        }
      }}
      className={cn(
        "group relative cursor-pointer overflow-hidden border-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        featured
          ? "bg-white shadow-xl shadow-slate-950/10 hover:shadow-xl dark:bg-card dark:shadow-black/30"
          : "bg-slate-50/80 shadow-sm hover:shadow-md dark:bg-muted",
      )}
    >
      <CardContent className={featured ? "p-6" : "p-5"}>
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
              className={cn(
                "mt-3 truncate font-semibold text-gray-900",
                featured ? "text-xl" : "text-lg",
              )}
            >
              {exam.patient}
            </h2>
            <p
              className={cn(
                "mt-0.5 text-gray-500",
                featured ? "text-base" : "text-sm",
              )}
            >
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
            <span
              className={cn(
                "font-medium text-gray-900",
                featured && "text-base",
              )}
            >
              {exam.type}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
              <Clock3 className="h-3.5 w-3.5" />
              {exam.received}
            </span>
          </div>
          <p title={exam.unit} className="mt-1 truncate text-xs text-gray-500">
            {exam.unit}
          </p>
        </div>
        <p
          className={cn(
            "mt-4 line-clamp-2 min-h-10 text-gray-600",
            featured ? "text-base leading-6" : "text-sm leading-5",
          )}
        >
          {exam.note}
        </p>
        <div className="mt-4 flex min-h-6 flex-wrap gap-1.5">
          {reasons.map((reason) => (
            <PriorityReason key={reason} reason={reason} />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <span className={cn("text-gray-500", featured ? "text-sm" : "text-xs")}>
            Waiting{" "}
            <span className="font-semibold text-gray-700">
              {formatMinutes(exam.waitingMinutes)}
            </span>
            {exam.assignedTo && (
              <span className="mt-0.5 block text-xs font-medium text-[#177bd1]">
                Assigned to {exam.assignedTo}
              </span>
            )}
          </span>
          {/* The card as a whole selects itself; these actions must not also
              trip that, or "Assign" would silently move the emphasis too. */}
          <div
            className="flex items-center gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Both actions carry the same size so the pair reads as one
                control group — only the variant marks the primary action. */}
            <Button
              size={featured ? "default" : "sm"}
              variant="outline"
              onClick={() => onAssign(exam)}
            >
              <UserRoundPlus className="mr-2" />
              Assign
            </Button>
            <Button
              asChild
              size={featured ? "default" : "sm"}
              variant={featured ? "default" : "outline"}
            >
              <Link href={`/exams/${exam.id}`}>Start report</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InboxTable({
  exams,
  score,
  density,
  visibleColumns,
  onAssign,
}: {
  exams: InboxExam[];
  score: (exam: InboxExam) => number;
  density: TableDensity;
  visibleColumns: string[];
  onAssign: (exam: InboxExam) => void;
}) {
  if (!exams.length) return <EmptyState />;
  const isVisible = (column: string) => visibleColumns.includes(column);
  const densityClass =
    density === "compact"
      ? "whitespace-nowrap py-2"
      : density === "spacious"
        ? "whitespace-normal break-words py-6"
        : "whitespace-nowrap py-4";
  return (
    <Card className="overflow-hidden border-gray-200 bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                {isVisible("priority") && <th className={`px-5 ${densityClass}`}>Priority</th>}
                <th className={`px-5 ${densityClass}`}>Patient</th>
                {isVisible("exam") && <th className={`px-5 ${densityClass}`}>Exam</th>}
                {isVisible("received") && <th className={`px-5 ${densityClass}`}>Received</th>}
                {isVisible("factors") && <th className={`px-5 ${densityClass}`}>Priority factors</th>}
                <th className={`px-5 text-right ${densityClass}`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exams.map((exam) => (
                <tr
                  key={exam.id}
                  className="transition-colors hover:bg-orange-50/70"
                >
                  {isVisible("priority") && <td className={`px-5 ${densityClass}`}><PriorityPill score={score(exam)} /></td>}
                  <td className={`px-5 ${densityClass}`}>
                    <div className="font-medium text-gray-900">
                      {exam.patient}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {exam.patientId} · {exam.age} years
                    </div>
                  </td>
                  {isVisible("exam") && <td className={`px-5 ${densityClass}`}>
                    <div className="font-medium text-gray-800">{exam.type}</div>
                    <div
                      className={cn(
                        "mt-0.5 text-xs text-gray-500",
                        density === "spacious"
                          ? "whitespace-normal break-words"
                          : "max-w-48 truncate",
                      )}
                    >
                      {exam.unit}
                    </div>
                  </td>}
                  {isVisible("received") && <td className={`px-5 text-gray-600 ${densityClass}`}>
                    <div>{exam.received}</div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      Waiting {formatMinutes(exam.waitingMinutes)}
                    </div>
                    {exam.assignedTo && (
                      <div className="mt-0.5 text-xs font-medium text-[#177bd1]">
                        Assigned to {exam.assignedTo}
                      </div>
                    )}
                  </td>}
                  {isVisible("factors") && <td className={`px-5 ${densityClass}`}>
                    <div className="flex max-w-64 flex-wrap gap-1.5">
                      {priorityReasons(exam).map((reason) => (
                        <PriorityReason key={reason} reason={reason} />
                      ))}
                    </div>
                  </td>}
                  <td className={`px-5 text-right ${densityClass}`}>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => onAssign(exam)}>
                        <UserRoundPlus className="mr-2" />
                        Assign
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/exams/${exam.id}`}>Report</Link>
                      </Button>
                    </div>
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
    <Badge variant={urgent ? "destructive" : elevated ? "warning" : "neutral"}>
      {urgent ? "Urgent" : elevated ? "Elevated" : "Routine"}
    </Badge>
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
