"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cardioline/ui";
import { patients } from "@/lib/mock-data";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  SortableHeader,
  type SortDirection,
} from "@/components/ui/sortable-header";
import { TableSettingsMenu } from "@/components/ui/table-settings-menu";
import { useGlobalTableDensity } from "@/components/ui/use-global-table-density";
import { AdvancedSearchModal } from "@/components/ui/advanced-search-modal";
import { PageHeader } from "@/components/ui/page-header";
import { RowActionsMenu } from "@/components/ui/row-actions-menu";
import { PrototypeToast } from "@/components/ui/prototype-toast";

type SortKey = "name" | "id" | "dob" | "lastExam" | "status";
type PatientFilters = {
  status: string[];
  bornFrom: string;
  bornTo: string;
  examPeriod: string;
};
const emptyFilters: PatientFilters = {
  status: [],
  bornFrom: "",
  bornTo: "",
  examPeriod: "",
};
const patientTableColumns = [
  { id: "name", label: "Patient name", locked: true },
  { id: "id", label: "ID / SSN" },
  { id: "dob", label: "Date of birth" },
  { id: "lastExam", label: "Last exam" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Actions", locked: true },
];

export default function PatientsPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<PatientFilters>(emptyFilters);
  const [sort, setSort] = React.useState<{
    key: SortKey;
    direction: SortDirection;
  }>({ key: "name", direction: "asc" });
  const [visibleColumns, setVisibleColumns] = React.useState(
    patientTableColumns.map((column) => column.id),
  );
  const [density, setDensity] = useGlobalTableDensity();
  const [pageSize, setPageSize] = React.useState(10);
  const [removedIds, setRemovedIds] = React.useState<string[]>([]);
  const [toast, setToast] = React.useState<string | null>(null);
  React.useEffect(
    () => setQuery(new URLSearchParams(window.location.search).get("q") ?? ""),
    [],
  );
  const list = patients
    .filter((patient) => matchesFilters(patient, query, filters) && !removedIds.includes(patient.id))
    .sort((a, b) => compare(a[sort.key], b[sort.key], sort.direction));
  const pageCount = Math.max(1, Math.ceil(list.length / pageSize));
  const visible = list.slice((page - 1) * pageSize, page * pageSize);
  const toggleSort = (key: SortKey) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
    setPage(1);
  };
  const applyFilters = (next: PatientFilters) => {
    setFilters(next);
    setPage(1);
    setFiltersOpen(false);
  };
  const isVisible = (column: string) => visibleColumns.includes(column);
  const densityClass =
    density === "compact"
      ? "whitespace-nowrap py-2"
      : density === "spacious"
        ? "whitespace-normal break-words py-6"
        : "whitespace-nowrap py-4";
  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Manage and view patient records."
        actions={<Button asChild className="bg-primary text-white">
          <Link href="/patients/new">
            <Plus className="mr-2" />
            Add Patient
          </Link>
        </Button>}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="relative w-full sm:w-[310px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search patients..."
              className="h-10 border-gray-200 bg-white pl-9"
            />
          </div>
          <Button variant="secondary" onClick={() => setAdvancedOpen(true)}>
            <SlidersHorizontal className="mr-2" />
            Advanced Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            className={
              hasFilters(filters)
                ? "border-orange-200 bg-orange-50 text-[#ee5b00]"
                : "border-gray-200 text-gray-600"
            }
          >
            <Filter className="mr-2" />
            Filter{hasFilters(filters) ? " · active" : ""}
          </Button>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <TableSettingsMenu
            columns={patientTableColumns}
            visibleColumns={visibleColumns}
            onVisibleColumnsChange={setVisibleColumns}
            density={density}
            onDensityChange={setDensity}
          />
        </div>
      </div>
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className={`px-6 ${densityClass}`}>
                    <SortableHeader
                      label="Patient name"
                      active={sort.key === "name"}
                      direction={sort.direction}
                      onClick={() => toggleSort("name")}
                    />
                  </th>
                  {isVisible("id") && (
                    <th className={`px-6 ${densityClass}`}>
                      <SortableHeader
                        label="ID / SSN"
                        active={sort.key === "id"}
                        direction={sort.direction}
                        onClick={() => toggleSort("id")}
                      />
                    </th>
                  )}
                  {isVisible("dob") && (
                    <th className={`px-6 ${densityClass}`}>
                      <SortableHeader
                        label="Date of birth"
                        active={sort.key === "dob"}
                        direction={sort.direction}
                        onClick={() => toggleSort("dob")}
                      />
                    </th>
                  )}
                  {isVisible("lastExam") && (
                    <th className={`px-6 ${densityClass}`}>
                      <SortableHeader
                        label="Last exam"
                        active={sort.key === "lastExam"}
                        direction={sort.direction}
                        onClick={() => toggleSort("lastExam")}
                      />
                    </th>
                  )}
                  {isVisible("status") && (
                    <th className={`px-6 ${densityClass}`}>
                      <SortableHeader
                        label="Status"
                        active={sort.key === "status"}
                        direction={sort.direction}
                        onClick={() => toggleSort("status")}
                      />
                    </th>
                  )}
                  <th className={`px-6 text-right ${densityClass}`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => router.push(`/patients/${patient.id}`)}
                    className="cursor-pointer transition-colors hover:bg-orange-50/70"
                  >
                    <td
                      title={patient.name}
                      className={`px-6 font-medium text-gray-900 ${densityClass}`}
                    >
                      {patient.name}
                    </td>
                    {isVisible("id") && (
                      <td
                        title={patient.id}
                        className={`px-6 text-gray-500 ${densityClass}`}
                      >
                        {patient.id}
                      </td>
                    )}
                    {isVisible("dob") && (
                      <td
                        title={patient.dob}
                        className={`px-6 text-gray-500 ${densityClass}`}
                      >
                        {patient.dob}
                      </td>
                    )}
                    {isVisible("lastExam") && (
                      <td
                        title={patient.lastExam}
                        className={`px-6 text-gray-500 ${densityClass}`}
                      >
                        {patient.lastExam}
                      </td>
                    )}
                    {isVisible("status") && (
                      <td
                        title={patient.status}
                        className={`px-6 ${densityClass}`}
                      >
                        <Status value={patient.status} />
                      </td>
                    )}
                    <td className={`px-6 ${densityClass}`}>
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/patients/${patient.id}`}>View</Link>
                        </Button>
                        <Button
                          asChild
                          size="icon"
                          variant="ghost"
                          aria-label={`Edit ${patient.name}`}
                        >
                          <Link href={`/patients/${patient.id}/edit`}>
                            <Edit />
                          </Link>
                        </Button>
                        <RowActionsMenu
                          entity="Patient"
                          name={patient.name}
                          onDelete={() => {
                            setRemovedIds((ids) => [...ids, patient.id]);
                            setToast(`${patient.name} removed from this mock list.`);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visible.length && (
              <p className="p-10 text-center text-sm text-gray-500">
                No patients match this search.
              </p>
            )}
          </div>
          <TablePagination
            page={page}
            pageCount={pageCount}
            total={list.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            }}
          />
        </CardContent>
      </Card>
      <PatientFilterModal
        open={filtersOpen}
        values={filters}
        onCancel={() => setFiltersOpen(false)}
        onApply={applyFilters}
      />
      <AdvancedSearchModal
        open={advancedOpen}
        onOpenChange={setAdvancedOpen}
        title="Advanced patient search"
        description="Refine the mock patient list using additional criteria."
        groups={[
          {
            label: "Date of birth",
            options: [
              "Born in the last 30 years",
              "Born 30–50 years ago",
              "Born more than 50 years ago",
            ],
          },
          {
            label: "Last exam",
            options: ["Today", "Last 7 days", "Last 30 days"],
          },
          { label: "Status", options: ["Active", "Critical", "Inactive"] },
        ]}
      />
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function PatientFilterModal({
  open,
  values,
  onCancel,
  onApply,
}: {
  open: boolean;
  values: PatientFilters;
  onCancel: () => void;
  onApply: (filters: PatientFilters) => void;
}) {
  const [draft, setDraft] = React.useState(values);
  React.useEffect(() => {
    if (open) setDraft(values);
  }, [open, values]);
  const toggleStatus = (value: string) =>
    setDraft((current) => ({
      ...current,
      status: current.status.includes(value)
        ? current.status.filter((item) => item !== value)
        : [...current.status, value],
    }));
  const periods = [
    ["any", "Any period"],
    ["today", "Today"],
    ["week", "Last 7 days"],
    ["month", "Last 30 days"],
  ] as const;
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onCancel(); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Filter patients</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <Label>Date of birth</Label>
            <Input
              type="date"
              value={draft.bornFrom}
              onChange={(event) =>
                setDraft({ ...draft, bornFrom: event.target.value })
              }
            />
            <Input
              type="date"
              value={draft.bornTo}
              onChange={(event) =>
                setDraft({ ...draft, bornTo: event.target.value })
              }
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="last-exam-period">Last exam date</Label>
            <Select
              value={draft.examPeriod || "any"}
              onValueChange={(value) =>
                setDraft({ ...draft, examPeriod: value === "any" ? "" : value })
              }
            >
              <SelectTrigger id="last-exam-period" className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Status</Label>
            <div className="grid gap-1 sm:grid-cols-3">
              {["Active", "Critical", "Inactive"].map((status) => (
                <label
                  key={status}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <Checkbox
                    checked={draft.status.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setDraft(emptyFilters)}
          >
            Clear
          </Button>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={() => onApply(draft)}>
              Apply filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function matchesFilters(
  patient: (typeof patients)[number],
  query: string,
  filters: PatientFilters,
) {
  if (
    !`${patient.name} ${patient.id}`.toLowerCase().includes(query.toLowerCase())
  )
    return false;
  if (filters.status.length && !filters.status.includes(patient.status))
    return false;
  const birthday = new Date(patient.dob);
  if (filters.bornFrom && birthday < new Date(filters.bornFrom)) return false;
  if (filters.bornTo && birthday > new Date(`${filters.bornTo}T23:59:59`))
    return false;
  const time = patient.lastExam.toLowerCase();
  if (filters.examPeriod === "today" && !/(mins|hour)/.test(time)) return false;
  if (filters.examPeriod === "week" && /week|2 weeks|3 weeks/.test(time))
    return false;
  if (filters.examPeriod === "month" && !/(min|hour|day|week)/.test(time))
    return false;
  return true;
}
function hasFilters(filters: PatientFilters) {
  return (
    filters.status.length > 0 ||
    Boolean(filters.bornFrom || filters.bornTo || filters.examPeriod)
  );
}
function compare(a: string, b: string, direction: SortDirection) {
  const result = a.localeCompare(b, undefined, { numeric: true });
  return direction === "asc" ? result : -result;
}
function Status({ value }: { value: string }) {
  const variant =
    value === "Active" ? "success" : value === "Critical" ? "destructive" : "neutral";
  return <Badge variant={variant}>{value}</Badge>;
}
