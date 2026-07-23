"use client";

import * as React from "react";
import Link from "next/link";
import {
  Download,
  FileText,
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@cardioline/ui";
import { reports } from "@/lib/mock-data";
import {
  SortableHeader,
  type SortDirection,
} from "@/components/ui/sortable-header";
import { TableSettingsMenu } from "@/components/ui/table-settings-menu";
import { useGlobalTableDensity } from "@/components/ui/use-global-table-density";
import { AdvancedSearchModal } from "@/components/ui/advanced-search-modal";
import { PageHeader } from "@/components/ui/page-header";

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
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [sort, setSort] = React.useState<{
    key: SortKey;
    direction: SortDirection;
  }>({ key: "date", direction: "desc" });
  const [visibleColumns, setVisibleColumns] = React.useState(
    reportTableColumns.map((column) => column.id),
  );
  const [density, setDensity] = useGlobalTableDensity();
  const list = reports
    .filter(
      (report) =>
        `${report.patient} ${report.type} ${report.id}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (!statusFilter.length || statusFilter.includes(report.status)),
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
  const toggleStatus = (status: string) =>
    setStatusFilter((current) =>
      current.includes(status)
        ? current.filter((value) => value !== status)
        : [...current, status],
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
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={
                  statusFilter.length
                    ? "border-orange-200 bg-orange-50 text-[#ee5b00]"
                    : ""
                }
              >
                <Filter className="mr-2" />
                Filter{statusFilter.length ? ` · ${statusFilter.length}` : ""}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>Report status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statuses.map((status) => (
                <label
                  key={status}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground"
                >
                  <Checkbox
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  {status}
                </label>
              ))}
              <DropdownMenuSeparator />
              <button
                type="button"
                onClick={() => setStatusFilter([])}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Clear filters
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
          <TableSettingsMenu
            columns={reportTableColumns}
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
                      <div className="flex justify-end gap-2">
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
