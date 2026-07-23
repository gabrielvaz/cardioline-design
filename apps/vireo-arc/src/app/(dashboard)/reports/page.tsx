"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Input,
  MultiSelectDropdown,
  RowActionsMenu,
  TableToolbarMenu,
} from "@cardioline/ui";
import { reports } from "@/lib/mock-data";
import {
  SortableHeader,
  type SortDirection,
} from "@/components/ui/sortable-header";
import { useGlobalTableDensity } from "@/components/ui/use-global-table-density";
import { AdvancedSearchModal } from "@/components/ui/advanced-search-modal";
import { PageHeader } from "@/components/ui/page-header";
import { PrototypeToast } from "@/components/ui/prototype-toast";

type SortKey = "id" | "patient" | "date" | "status";
const reportTableColumns = [
  { id: "report", label: "Report" },
  { id: "patient", label: "Patient name", locked: true },
  { id: "date", label: "Generated" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Actions", locked: true },
];

export default function ReportsPage() {
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [filtersShown, setFiltersShown] = React.useState(true);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [sort, setSort] = React.useState<{
    key: SortKey;
    direction: SortDirection;
  }>({ key: "date", direction: "desc" });
  const [visibleColumns, setVisibleColumns] = React.useState(
    reportTableColumns.map((column) => column.id),
  );
  const [density, setDensity] = useGlobalTableDensity();
  const [removedIds, setRemovedIds] = React.useState<string[]>([]);
  const [toast, setToast] = React.useState<string | null>(null);
  const list = reports
    .filter(
      (report) =>
        `${report.patient} ${report.type} ${report.id}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (!statusFilter.length || statusFilter.includes(report.status)) &&
        !removedIds.includes(report.id),
    )
    .sort((a, b) => {
      const result = String(a[sort.key]).localeCompare(
        String(b[sort.key]),
        undefined,
        { numeric: true },
      );
      return sort.direction === "asc" ? result : -result;
    });
  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
  const isVisible = (column: string) => visibleColumns.includes(column);
  const densityClass =
    density === "compact"
      ? "whitespace-nowrap py-2"
      : density === "spacious"
        ? "whitespace-normal break-words py-6"
        : "whitespace-nowrap py-4";
  const statuses = ["Finalized", "Pending Review", "Draft"];
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generated medical reports and findings."
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="relative w-full sm:w-[310px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search reports..."
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
            columns={reportTableColumns}
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
              options={statuses.map((label) => ({ label }))}
              value={statusFilter}
              onChange={setStatusFilter}
              align="start"
            />
            <button
              type="button"
              onClick={() => setStatusFilter([])}
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
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  {isVisible("report") && (
                    <th className={`px-6 ${densityClass}`}>
                      <SortableHeader
                        label="Report"
                        active={sort.key === "id"}
                        direction={sort.direction}
                        onClick={() => toggleSort("id")}
                      />
                    </th>
                  )}
                  <th className={`px-6 ${densityClass}`}>
                    <SortableHeader
                      label="Patient"
                      active={sort.key === "patient"}
                      direction={sort.direction}
                      onClick={() => toggleSort("patient")}
                    />
                  </th>
                  {isVisible("date") && (
                    <th className={`px-6 ${densityClass}`}>
                      <SortableHeader
                        label="Generated"
                        active={sort.key === "date"}
                        direction={sort.direction}
                        onClick={() => toggleSort("date")}
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
                {list.map((report) => (
                  <tr
                    key={report.id}
                    className="cursor-pointer transition-colors hover:bg-orange-50/70"
                  >
                    {isVisible("report") && (
                      <td
                        title={`${report.type} · ${report.id}`}
                        className={`px-6 ${densityClass}`}
                      >
                        <Link
                          href={`/reports/${report.id}`}
                          className="flex items-center gap-3 font-medium text-gray-900"
                        >
                          <FileText className="h-4 w-4 text-[#ee5b00]" />
                          {report.type}
                          <span className="text-xs font-normal text-gray-400">
                            {report.id}
                          </span>
                        </Link>
                      </td>
                    )}
                    <td
                      title={report.patient}
                      className={`px-6 text-gray-700 ${densityClass}`}
                    >
                      <Link href={`/reports/${report.id}`} className="block">
                        {report.patient}
                      </Link>
                    </td>
                    {isVisible("date") && (
                      <td
                        title={report.date}
                        className={`px-6 text-gray-500 ${densityClass}`}
                      >
                        <Link href={`/reports/${report.id}`} className="block">
                          {report.date}
                        </Link>
                      </td>
                    )}
                    {isVisible("status") && (
                      <td
                        title={report.status}
                        className={`px-6 ${densityClass}`}
                      >
                        <Status status={report.status} />
                      </td>
                    )}
                    <td className={`px-6 ${densityClass}`}>
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/reports/${report.id}`}>View</Link>
                        </Button>
                        <Button
                          asChild
                          size="icon"
                          variant="ghost"
                          aria-label={`Download ${report.id}`}
                          className="text-[#ee5b00]"
                        >
                          <a href={`/api/reports/${report.id}`} download>
                            <Download />
                          </a>
                        </Button>
                        <RowActionsMenu
                          confirmTitle="Delete Report"
                          confirmDescription="Are you sure you want to delete this report? This action is permanent and cannot be undone."
                          name={`${report.type} ${report.id}`}
                          onDelete={() => {
                            setRemovedIds((ids) => [...ids, report.id]);
                            setToast(`${report.type} ${report.id} removed from this mock list.`);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!list.length && (
              <p className="p-10 text-center text-sm text-gray-500">
                No reports match this search.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <AdvancedSearchModal
        open={advancedOpen}
        onOpenChange={setAdvancedOpen}
        title="Advanced report search"
        description="Refine the mock report list using additional criteria."
        groups={[
          {
            label: "Report type",
            options: [
              "Resting ECG Report",
              "Holter 24h Summary",
              "Stress Test Findings",
            ],
          },
          {
            label: "Generated date",
            options: ["Today", "Last 7 days", "Last 30 days"],
          },
          { label: "Status", options: statuses },
        ]}
      />
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function Status({ status }: { status: string }) {
  const cls =
    status === "Finalized"
      ? "bg-green-100 text-green-700"
      : status === "Pending Review"
        ? "bg-orange-100 text-orange-700"
        : "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      {status}
    </span>
  );
}
