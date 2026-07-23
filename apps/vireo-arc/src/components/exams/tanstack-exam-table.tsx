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
import { ArrowDown, ArrowUp, ChevronsUpDown, Download, Eye, FileText, MoreHorizontal, PenLine, Repeat2, Trash2, UserRound } from 'lucide-react';
import { Button, Card, CardContent } from '@cardioline/ui';
import { exams, reports } from '@/lib/mock-data';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PrototypeToast } from '@/components/ui/prototype-toast';
import { TablePagination } from '@/components/ui/table-pagination';
import type { TableDensity } from '@/components/ui/table-settings-menu';

type ExamRow = (typeof exams)[number] & { key: number; unit: string; modifiedBy: string };

const tableRows: ExamRow[] = exams.map((exam, index) => ({
  ...exam,
  key: index,
  unit: ['Via Paoletti', 'Bella Salute', 'San Giovanni'][index % 3],
  modifiedBy: ['Carlos Almeida', 'Andrea Bigazzi', 'Luca Moretti'][index % 3],
}));

const visibilityLabels: Record<string, string> = {
  id: 'Exam ID', name: 'Patient name', patientId: 'Patient ID', date: 'Reception', unit: 'Unit', modifiedBy: 'Modified by', type: 'Exam type', result: 'Summary', actions: 'Actions',
};

export function TanstackExamTable({ query, visibleColumns, density }: { query: string; visibleColumns: string[]; density: TableDensity }) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'date', desc: true }]);
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [toast, setToast] = React.useState<string | null>(null);
  const [examToDelete, setExamToDelete] = React.useState<string | null>(null);
  const columnVisibility = React.useMemo(() => Object.fromEntries(Object.keys(visibilityLabels).map((id) => [id, visibleColumns.includes(id)])), [visibleColumns]);
  const cellDensity = density === 'compact' ? 'whitespace-nowrap py-2' : density === 'spacious' ? 'whitespace-normal break-words py-5' : 'whitespace-nowrap py-3';

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
      const report = reports.find((item) => item.examId === exam.id);
      return <div className="flex gap-1" onClick={(event) => event.stopPropagation()}>
        <Button asChild size="icon" variant="ghost"><Link href={`/exams/${exam.id}`} aria-label="View exam"><Eye /></Link></Button>
        {report ? <Button asChild size="icon" variant="ghost"><Link href={`/reports/${report.id}`} aria-label="View report"><FileText /></Link></Button> : <Button size="icon" variant="ghost" disabled aria-label="Report unavailable"><FileText /></Button>}
        <RowActions id={exam.id} onAction={setToast} onDelete={setExamToDelete} />
        <Button size="icon" variant="ghost" onClick={() => setToast(`${exam.id} downloaded.`)} aria-label="Download exam"><Download /></Button>
      </div>;
    } },
  ], []);

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

  React.useEffect(() => { table.setPageIndex(0); }, [query, visibleColumns, table]);
  const total = table.getFilteredRowModel().rows.length;

  return <>
    <Card className="border-gray-200 bg-white shadow-sm"><CardContent className="p-0"><div className="overflow-x-auto"><table className="min-w-[1100px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs text-gray-600">{table.getHeaderGroups().map((headerGroup) => <tr key={headerGroup.id}>{headerGroup.headers.map((header) => <th key={header.id} className={`px-4 ${cellDensity}`}><TanstackHeader header={header} /></th>)}</tr>)}</thead><tbody className="divide-y divide-gray-100">{table.getRowModel().rows.map((row) => <tr key={row.id} onClick={() => router.push(`/exams/${row.original.id}`)} className="cursor-pointer transition-colors hover:bg-orange-50/70">{row.getVisibleCells().map((cell) => <td key={cell.id} title={cell.column.id === 'actions' ? undefined : String(cell.getValue() ?? '')} className={`px-4 ${cellDensity}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody></table>{!table.getRowModel().rows.length && <p className="p-10 text-center text-sm text-gray-500">No exams match these filters.</p>}</div><TablePagination page={table.getState().pagination.pageIndex + 1} pageCount={table.getPageCount()} total={total} pageSize={table.getState().pagination.pageSize} onPageChange={(page) => table.setPageIndex(page - 1)} onPageSizeChange={(pageSize) => { table.setPageSize(pageSize); table.setPageIndex(0); }} /></CardContent></Card>
    <PrototypeToast message={toast} onClose={() => setToast(null)} />
    <ConfirmDialog open={Boolean(examToDelete)} title="Delete Exam" description="Are you sure you want to delete this exam? This action is permanent and the data cannot be recovered." onCancel={() => setExamToDelete(null)} onConfirm={() => { setToast(`${examToDelete} deleted from this mock list.`); setExamToDelete(null); }} />
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

function RowActions({ id, onAction, onDelete }: { id: string; onAction: (text: string) => void; onDelete: (id: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const choose = (name: string) => { setOpen(false); if (name === 'Delete') onDelete(id); else onAction(`${name} started for ${id}.`); };
  const actions = [[PenLine, 'Sign report'], [Repeat2, 'Reassociate'], [UserRound, 'Assign to a doctor'], [Trash2, 'Delete']] as const;
  return <div className="relative"><Button size="icon" variant="ghost" onClick={() => setOpen(!open)} aria-label="More exam actions"><MoreHorizontal /></Button>{open && <div className="absolute right-0 top-10 z-30 w-60 rounded-lg border border-gray-200 bg-white p-2 shadow-xl">{actions.map(([Icon, item], index) => <button key={item} onClick={() => choose(item)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium ${index === 0 ? 'bg-orange-50 text-[#ee5b00]' : item === 'Delete' ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}><Icon className="h-5 w-5" />{item}</button>)}</div>}</div>;
}
