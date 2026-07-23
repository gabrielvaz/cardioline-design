"use client";

import * as React from "react";
import { ListFilter, Search, SlidersHorizontal } from "lucide-react";
import { Button, Input } from "@cardioline/ui";
import { AdvancedExamFilters } from "@/components/exams/advanced-filters";
import {
  ExamFilterDropdown,
  type ExamFilterOption,
} from "@/components/exams/exam-filter-dropdown";
import { PrototypeToast } from "@/components/ui/prototype-toast";
import { TanstackExamTable } from "@/components/exams/tanstack-exam-table";
import { TableSettingsMenu } from "@/components/ui/table-settings-menu";
import { useGlobalTableDensity } from "@/components/ui/use-global-table-density";

const filterDefinitions: Record<string, ExamFilterOption[]> = {
  Period: [
    { label: "Today" },
    { label: "Last 7 days" },
    { label: "Last 30 days" },
    { label: "Custom period" },
  ],
  "Exam type": [
    { group: "ECG", label: "Resting ECG" },
    { group: "ECG", label: "ECG single lead" },
    { group: "ECG", label: "ECG single lead (PDF)" },
    { group: "Holter", label: "Holter ECG" },
    { group: "Holter", label: "Holter ECG (PDF)" },
    { group: "Stress test", label: "Stress test" },
    { group: "Stress test", label: "Stress test (PDF)" },
    { group: "Spirometry", label: "Spirometry" },
    { group: "Others", label: "Blood pressure" },
    { group: "Others", label: "Oximetry" },
  ],
  Status: [
    { label: "Pending review" },
    { label: "Analysed" },
    { label: "Reviewed" },
    { label: "Signed" },
  ],
  Summary: [
    { label: "Unspecified" },
    { label: "Normal" },
    { label: "Borderline" },
    { label: "Abnormal" },
    { label: "Rejected" },
  ],
  STAT: [{ label: "STAT exams" }, { label: "Non STAT exams" }],
  Pediatric: [{ label: "Pediatric exams" }, { label: "Non Pediatric exams" }],
  Units: [
    { label: "Via Paoletti" },
    { label: "Bella Salute" },
    { label: "San Giovanni" },
  ],
};

const tableColumns = [
  { id: "id", label: "Exam ID" },
  { id: "name", label: "Patient name", locked: true },
  { id: "patientId", label: "Patient ID" },
  { id: "date", label: "Reception" },
  { id: "unit", label: "Unit" },
  { id: "modifiedBy", label: "Modified by" },
  { id: "type", label: "Exam type" },
  { id: "result", label: "Summary" },
  { id: "actions", label: "Actions", locked: true },
];

export default function ExamsPage() {
  const [query, setQuery] = React.useState("");
  const [advanced, setAdvanced] = React.useState(false);
  const [visibleColumns, setVisibleColumns] = React.useState(
    tableColumns.map((column) => column.id),
  );
  const [density, setDensity] = useGlobalTableDensity();
  const [toast, setToast] = React.useState<string | null>(null);
  const [filterValues, setFilterValues] = React.useState<
    Record<string, string[]>
  >({
    "Exam type": [
      "Resting ECG",
      "ECG single lead",
      "ECG single lead (PDF)",
      "Holter ECG",
      "Holter ECG (PDF)",
      "Stress test",
      "Stress test (PDF)",
      "Spirometry",
    ],
  });
  const updateFilter = (name: string, values: string[]) =>
    setFilterValues((current) => ({ ...current, [name]: values }));
  const clearFilters = () => {
    setFilterValues({});
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-[#071046]">
            Exam list
          </h1>
          <Button
            onClick={() => setToast("Report area opened.")}
            className="h-11 shrink-0 bg-primary px-5 text-white"
          >
            Report area
          </Button>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-full w-max items-center gap-2 pr-1">
            {Object.entries(filterDefinitions).map(([name, options]) => (
              <ExamFilterDropdown
                key={name}
                label={name}
                options={options}
                selected={filterValues[name] ?? []}
                onChange={(values) => updateFilter(name, values)}
                accent={name === "Exam type"}
              />
            ))}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setToast("Filters applied to the mock list.")}
              className="ml-1 h-9 shrink-0"
            >
              <ListFilter className="mr-2" />
              Apply filter
            </Button>
            <button
              type="button"
              onClick={clearFilters}
              className="ml-2 shrink-0 text-sm font-medium text-gray-600 underline underline-offset-2 hover:text-[#071046]"
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-[310px]">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type to search..."
                className="h-11 border-gray-200 bg-white pl-10"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setAdvanced(true)}
              className="h-11 justify-start px-5 sm:justify-center"
            >
              <SlidersHorizontal className="mr-2" />
              Advanced Search
            </Button>
          </div>
          <div className="flex items-center gap-3 self-end lg:self-auto">
            <TableSettingsMenu
              columns={tableColumns}
              visibleColumns={visibleColumns}
              onVisibleColumnsChange={setVisibleColumns}
              density={density}
              onDensityChange={setDensity}
            />
          </div>
        </div>
      </section>

      {advanced && <AdvancedExamFilters onClose={() => setAdvanced(false)} />}
      <TanstackExamTable
        query={query}
        visibleColumns={visibleColumns}
        density={density}
      />
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
