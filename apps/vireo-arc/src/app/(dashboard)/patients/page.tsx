"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  MultiSelectDropdown,
  RowActionsMenu,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableToolbarMenu,
} from "@cardioline/ui";
import { patients } from "@/lib/mock-data";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  SortableHeader,
  type SortDirection,
} from "@/components/ui/sortable-header";
import { useGlobalTableDensity } from "@/components/ui/use-global-table-density";
import { AdvancedSearchModal } from "@/components/ui/advanced-search-modal";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
import { PageHeader } from "@/components/ui/page-header";
import { PrototypeToast } from "@/components/ui/prototype-toast";

const lastExamLabels: Record<string, string> = {
  any: "Any period",
  today: "Today",
  week: "Last 7 days",
  month: "Last 30 days",
};

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
  const [filtersShown, setFiltersShown] = React.useState(true);
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
  const updateFilters = (patch: Partial<PatientFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };
  const clearFilters = () => {
    setFilters(emptyFilters);
    setPage(1);
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
            onClick={() => setFiltersShown((shown) => !shown)}
          >
            {filtersShown ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
            {filtersShown ? "Hide filters" : "Show filters"}
          </Button>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <TableToolbarMenu
            columns={patientTableColumns}
            visibleColumns={visibleColumns}
            onVisibleColumnsChange={setVisibleColumns}
            density={density}
            onDensityChange={setDensity}
          />
        </div>
      </div>

      {filtersShown && (
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-full w-max items-center gap-3 pr-1">
            <MultiSelectDropdown
              label="Status"
              options={[{ label: "Active" }, { label: "Critical" }, { label: "Inactive" }]}
              value={filters.status}
              onChange={(values) => updateFilters({ status: values })}
              align="start"
            />
            <DateRangeFilter
              label="Born"
              from={filters.bornFrom}
              to={filters.bornTo}
              onApply={({ from, to }) => updateFilters({ bornFrom: from, bornTo: to })}
            />
            <Select
              value={filters.examPeriod || "any"}
              onValueChange={(value) =>
                updateFilters({ examPeriod: value === "any" ? "" : value })
              }
            >
              <SelectTrigger className="h-9 w-auto shrink-0 gap-2 px-3">
                <SelectValue>{`Last exam: ${lastExamLabels[filters.examPeriod || "any"]}`}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any period</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 shrink-0 text-sm font-medium text-gray-600 underline underline-offset-2 hover:text-[#071046]"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

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
                          confirmTitle="Delete Patient"
                          confirmDescription="Are you sure you want to delete this patient? This action is permanent and cannot be undone."
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
function compare(a: string, b: string, direction: SortDirection) {
  const result = a.localeCompare(b, undefined, { numeric: true });
  return direction === "asc" ? result : -result;
}
function Status({ value }: { value: string }) {
  const variant =
    value === "Active" ? "success" : value === "Critical" ? "destructive" : "neutral";
  return <Badge variant={variant}>{value}</Badge>;
}
