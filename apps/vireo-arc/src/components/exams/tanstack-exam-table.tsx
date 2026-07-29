'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type Header,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, Download, Eye, FileText, PenLine, Repeat2, UserRound } from 'lucide-react';
import { Button, Card, CardContent, RowActionsMenu, type TableDensity } from '@cardioline/ui';
import { usePrototypeData, type Exam } from '@/lib/prototype-data';
import { PrototypeToast } from '@/components/ui/prototype-toast';
import { TablePagination } from '@/components/ui/table-pagination';
import { AssignmentDialog, type AssignableExam } from '@/components/exams/assignment-dialog';

type ExamRow = Exam & { key: string; unit: string; modifiedBy: string };

/** Deterministic pseudo-random pick so each exam keeps stable mock metadata. */
function pickById<T>(id: string, options: T[]): T {
  const hash = [...id].reduce((total, char) => total + char.charCodeAt(0), 0);
  return options[hash % options.length];
}

/** Anchor "today" of the mock timeline for period-based filtering. */
const EXAMS_ANCHOR = new Date('2026-10-24T23:59:59');

function examDate(date: string) {
  const match = date.match(/(\w{3}) (\d+), (\d{4})/);
  return match ? new Date(`${match[1]} ${match[2]}, ${match[3]}`) : null;
}

function matchesType(type: string, option: string) {
  const examType = type.toLowerCase();
  const filter = option.toLowerCase();
  if (filter.includes('holter')) return examType.includes('holter');
  if (filter.includes('stress')) return examType.includes('stress');
  if (filter.includes('resting')) return examType.includes('resting');
  if (filter.includes('single lead')) return examType.includes('single lead');
  return false;
}

type FilterContext = { statIds: Set<string>; pediatricIds: Set<string> };

function matchesOption(row: ExamRow, category: string, option: string, context: FilterContext) {
  switch (category) {
    case 'Period': {
      if (option === 'Custom period') return true;
      const date = examDate(row.date);
      if (!date) return false;
      const daysAgo = Math.round((EXAMS_ANCHOR.getTime() - date.getTime()) / 86_400_000);
      if (option === 'Today') return daysAgo <= 0;
      if (option === 'Last 7 days') return daysAgo <= 7;
      if (option === 'Last 30 days') return daysAgo <= 30;
      return true;
    }
    case 'Exam type':
      return matchesType(row.type, option);
    case 'Status':
      return option === 'Pending review'
        ? row.result === 'Pending Review'
        : row.result !== 'Pending Review';
    case 'Summary':
      return row.result.toLowerCase() === option.toLowerCase();
    case 'STAT':
      return option === 'STAT exams' ? context.statIds.has(row.id) : !context.statIds.has(row.id);
    case 'Pediatric':
      return option === 'Pediatric exams' ? context.pediatricIds.has(row.id) : !context.pediatricIds.has(row.id);
    case 'Units':
      return row.unit === option;
    default:
      return true;
  }
}

function matchesAdvancedOption(row: ExamRow, group: string, option: string, context: FilterContext) {
  switch (group) {
    case 'Exam type':
      return matchesType(row.type, option);
    case 'Status':
      if (option === 'Pending review') return row.result === 'Pending Review';
      return row.result.toLowerCase() === option.toLowerCase();
    case 'Summary':
      return row.result.toLowerCase() === option.toLowerCase();
    case 'STAT':
      return context.statIds.has(row.id);
    case 'Pediatric':
      return context.pediatricIds.has(row.id);
    case 'Units':
      return row.unit === option;
    default:
      return true;
  }
}

/** AND across categories, OR inside each category. Empty categories are ignored. */
function matchesFilters(row: ExamRow, filters: Record<string, string[]>, context: FilterContext) {
  return Object.entries(filters).every(([category, selected]) =>
    !selected.length || selected.some((option) => matchesOption(row, category, option, context)),
  );
}

function matchesAdvanced(row: ExamRow, groups: Record<string, string[]>, context: FilterContext) {
  return Object.entries(groups).every(([group, selected]) =>
    !selected.length || selected.some((option) => matchesAdvancedOption(row, group, option, context)),
  );
}

const visibilityLabels: Record<string, string> = {
  id: 'Exam ID', name: 'Patient name', patientId: 'Patient ID', date: 'Reception', unit: 'Unit', modifiedBy: 'Modified by', type: 'Exam type', result: 'Summary', actions: 'Actions',
};

export function TanstackExamTable({ query, visibleColumns, density, filters = {}, advancedFilters = {} }: { query: string; visibleColumns: string[]; density: TableDensity; filters?: Record<string, string[]>; advancedFilters?: Record<string, string[]> }) {
  const router = useRouter();
  const { data, deleteExam } = usePrototypeData();
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'date', desc: true }]);
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [toast, setToast] = React.useState<string | null>(null);
  const [assignmentExam, setAssignmentExam] = React.useState<AssignableExam | null>(null);
  const columnVisibility = React.useMemo(() => Object.fromEntries(Object.keys(visibilityLabels).map((id) => [id, visibleColumns.includes(id)])), [visibleColumns]);
  const cellDensity = density === 'compact' ? 'whitespace-nowrap py-2' : density === 'spacious' ? 'whitespace-normal break-words py-5' : 'whitespace-nowrap py-3';
  const filterContext = React.useMemo<FilterContext>(() => ({
    statIds: new Set(data.inbox.filter((exam) => exam.emergency).map((exam) => exam.id)),
    pediatricIds: new Set(data.inbox.filter((exam) => exam.pediatric).map((exam) => exam.id)),
  }), [data.inbox]);
  const tableRows = React.useMemo<ExamRow[]>(() => data.exams.map((exam) => ({
    ...exam,
    key: exam.id,
    unit: pickById(exam.id, ['Via Paoletti', 'Bella Salute', 'San Giovanni']),
    modifiedBy: pickById(exam.id, ['Carlos Almeida', 'Andrea Bigazzi', 'Luca Moretti']),
  })).filter((row) => matchesFilters(row, filters, filterContext) && matchesAdvanced(row, advancedFilters, filterContext)), [data.exams, filters, advancedFilters, filterContext]);

  const columns = React.useMemo<ColumnDef<ExamRow>[]>(() => [
    { accessorKey: 'id', header: 'Exam ID', cell: ({ row }) => <span className="font-semibold">{row.original.id}</span> },
    { accessorKey: 'name', header: 'Patient name', cell: ({ row }) => <span className="font-medium text-[#177bd1]">{row.original.name}</span> },
    { accessorKey: 'patientId', header: 'Patient ID' },
    { accessorKey: 'date', header: 'Reception' },
    { accessorKey: 'unit', header: 'Unit', cell: ({ row }) => <span className="text-[#177bd1]">{row.original.unit}</span> },
    { accessorKey: 'modifiedBy', header: 'Modified by' },
    { accessorKey: 'type', header: 'Exam type' },
    { accessorKey: 'result', header: 'Summary', cell: ({ row }) => <Status value={row.original.result} /> },
    { id: 'actions', header: 'Actions', enableSorting: false, cell: ({ row }) => {
      const exam = row.original;
      const report = data.reports.find((item) => item.examId === exam.id);
      return <div className="flex gap-1" onClick={(event) => event.stopPropagation()}>
        <Button asChild size="icon" variant="ghost"><Link href={`/exams/${exam.id}`} aria-label="View exam"><Eye /></Link></Button>
        {report ? <Button asChild size="icon" variant="ghost"><Link href={`/reports/${report.id}`} aria-label="View report"><FileText /></Link></Button> : <Button size="icon" variant="ghost" disabled aria-label="Report unavailable"><FileText /></Button>}
        <Button size="icon" variant="ghost" onClick={() => setToast(`${exam.id} downloaded.`)} aria-label="Download exam"><Download /></Button>
        <RowActionsMenu
          confirmTitle="Delete Exam"
          confirmDescription="Are you sure you want to delete this exam? This action is permanent and cannot be undone."
          name={exam.id}
          actions={[
            { icon: PenLine, label: 'Sign report', onSelect: () => setToast(`Sign report started for ${exam.id}.`) },
            { icon: Repeat2, label: 'Reassociate', onSelect: () => setToast(`Reassociate started for ${exam.id}.`) },
            { icon: UserRound, label: 'Assign to a doctor', onSelect: () => setAssignmentExam({ id: exam.id, patient: exam.name, patientId: exam.patientId, type: exam.type }) },
          ]}
          onDelete={() => { deleteExam(exam.id); setToast(`${exam.id} deleted from this mock list.`); }}
        />
      </div>;
    } },
  ], [data.reports, deleteExam]);

  const table = useReactTable({
    data: tableRows,
    columns,
    state: { sorting, pagination, globalFilter: query, columnVisibility },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => `${row.original.name} ${row.original.id} ${row.original.type}`.toLowerCase().includes(String(filterValue).toLowerCase()),
  });

  React.useEffect(() => { table.setPageIndex(0); }, [query, visibleColumns, filters, advancedFilters, table]);
  const total = table.getFilteredRowModel().rows.length;

  return <>
    <Card className="border-gray-200 bg-white shadow-sm"><CardContent className="p-0"><div className="overflow-x-auto"><table className="min-w-[1100px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs text-gray-600">{table.getHeaderGroups().map((headerGroup) => <tr key={headerGroup.id}>{headerGroup.headers.map((header) => <th key={header.id} className={`px-4 ${cellDensity}`}><TanstackHeader header={header} /></th>)}</tr>)}</thead><tbody className="divide-y divide-gray-100">{table.getRowModel().rows.map((row) => <tr key={row.id} onClick={() => router.push(`/exams/${row.original.id}`)} className="cursor-pointer transition-colors hover:bg-orange-50/70">{row.getVisibleCells().map((cell) => <td key={cell.id} title={cell.column.id === 'actions' ? undefined : String(cell.getValue() ?? '')} className={`px-4 ${cellDensity}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody></table>{!table.getRowModel().rows.length && <p className="p-10 text-center text-sm text-gray-500">No exams match these filters.</p>}</div><TablePagination page={table.getState().pagination.pageIndex + 1} pageCount={table.getPageCount()} total={total} pageSize={table.getState().pagination.pageSize} onPageChange={(page) => table.setPageIndex(page - 1)} onPageSizeChange={(pageSize) => { table.setPageSize(pageSize); table.setPageIndex(0); }} /></CardContent></Card>
    <AssignmentDialog exam={assignmentExam} onOpenChange={(open) => !open && setAssignmentExam(null)} onAssign={(professional) => { setToast(`${assignmentExam?.id} assigned to ${professional}.`); setAssignmentExam(null); }} />
    <PrototypeToast message={toast} onClose={() => setToast(null)} />
  </>;
}

function TanstackHeader({ header }: { header: Header<ExamRow, unknown> }) {
  if (header.isPlaceholder) return null;
  const canSort = header.column.getCanSort();
  const sorted = header.column.getIsSorted();
  const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ChevronsUpDown;
  const content = flexRender(header.column.columnDef.header, header.getContext());
  if (!canSort) return <span className="inline-flex w-full items-center font-medium uppercase tracking-wide">{content}</span>;
  return <button type="button" onClick={header.column.getToggleSortingHandler()} className="inline-flex w-full items-center gap-1.5 font-medium uppercase tracking-wide transition-colors hover:text-slate-900"><span>{content}</span><Icon className={`h-3.5 w-3.5 ${sorted ? 'text-[#ee5b00]' : 'text-slate-400'}`} /></button>;
}

function Status({ value }: { value: string }) { const color = value === 'Normal' ? 'bg-green-100 text-green-700' : value === 'Abnormal' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'; return <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>{value}</span>; }
