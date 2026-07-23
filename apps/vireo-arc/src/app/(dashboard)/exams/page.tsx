'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Eye, FileText, ListFilter, MoreHorizontal, PenLine, Search, SlidersHorizontal, Trash2, UserRound, Repeat2 } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@cardioline/ui';
import { exams, reports } from '@/lib/mock-data';
import { AdvancedExamFilters } from '@/components/exams/advanced-filters';
import { ExamFilterDropdown, type ExamFilterOption } from '@/components/exams/exam-filter-dropdown';
import { PrototypeToast } from '@/components/ui/prototype-toast';
import { TablePagination } from '@/components/ui/table-pagination';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { SortableHeader, type SortDirection } from '@/components/ui/sortable-header';

const rows = exams.map((exam, index) => ({
  ...exam, key: index,
  unit: ['Via Paoletti', 'Bella Salute', 'San Giovanni'][index % 3],
  modifiedBy: ['Carlos Almeida', 'Andrea Bigazzi', 'Luca Moretti'][index % 3],
}));

const filterDefinitions: Record<string, ExamFilterOption[]> = {
  Period: [{ label: 'Today' }, { label: 'Last 7 days' }, { label: 'Last 30 days' }, { label: 'Custom period' }],
  'Exam type': [
    { group: 'ECG', label: 'Resting ECG' }, { group: 'ECG', label: 'ECG single lead' }, { group: 'ECG', label: 'ECG single lead (PDF)' },
    { group: 'Holter', label: 'Holter ECG' }, { group: 'Holter', label: 'Holter ECG (PDF)' },
    { group: 'Stress test', label: 'Stress test' }, { group: 'Stress test', label: 'Stress test (PDF)' },
    { group: 'Spirometry', label: 'Spirometry' }, { group: 'Others', label: 'Blood pressure' }, { group: 'Others', label: 'Oximetry' },
  ],
  Status: [{ label: 'Pending review' }, { label: 'Analysed' }, { label: 'Reviewed' }, { label: 'Signed' }],
  Summary: [{ label: 'Unspecified' }, { label: 'Normal' }, { label: 'Borderline' }, { label: 'Abnormal' }, { label: 'Rejected' }],
  STAT: [{ label: 'STAT exams' }, { label: 'Non STAT exams' }],
  Pediatric: [{ label: 'Pediatric exams' }, { label: 'Non Pediatric exams' }],
  Units: [{ label: 'Via Paoletti' }, { label: 'Bella Salute' }, { label: 'San Giovanni' }],
};

const columnOptions: ExamFilterOption[] = [
  { label: 'Patient ID' }, { label: 'Reception' }, { label: 'Unit' }, { label: 'Modified by' },
  { label: 'Exam type' }, { label: 'Summary' }, { label: 'Status' }, { label: 'Actions' },
];
type ExamSortKey = 'id' | 'name' | 'patientId' | 'date' | 'unit' | 'modifiedBy' | 'type' | 'result';

export default function ExamsPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [advanced, setAdvanced] = React.useState(false);
  const [visibleColumns, setVisibleColumns] = React.useState(['Patient ID', 'Reception', 'Unit', 'Modified by', 'Exam type', 'Summary', 'Status', 'Actions']);
  const [toast, setToast] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [examToDelete, setExamToDelete] = React.useState<string | null>(null);
  const [sort, setSort] = React.useState<{ key: ExamSortKey; direction: SortDirection }>({ key: 'date', direction: 'desc' });
  const pageSize = 10;
  const [filterValues, setFilterValues] = React.useState<Record<string, string[]>>({
    'Exam type': ['Resting ECG', 'ECG single lead', 'ECG single lead (PDF)', 'Holter ECG', 'Holter ECG (PDF)', 'Stress test', 'Stress test (PDF)', 'Spirometry'],
  });
  const updateFilter = (name: string, values: string[]) => setFilterValues((current) => ({ ...current, [name]: values }));
  const list = rows.filter((exam) => {
    const matchesText = `${exam.name} ${exam.id} ${exam.type}`.toLowerCase().includes(query.toLowerCase());
    const summary = filterValues.Summary ?? [];
    return matchesText && (!summary.length || summary.includes(exam.result));
  }).sort((a, b) => { const result = String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true }); return sort.direction === 'asc' ? result : -result; });
  const clearFilters = () => { setFilterValues({}); setQuery(''); };
  const pageCount = Math.max(1, Math.ceil(list.length / pageSize));
  const visibleRows = list.slice((page - 1) * pageSize, page * pageSize);
  const toggleSort = (key: ExamSortKey) => { setSort((current) => current.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }); setPage(1); };

  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <div>
          <p className="text-sm font-medium text-gray-600">Exams <span className="px-1 text-gray-400">›</span> Exam list</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#071046]">Exam list</h1>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-full w-max items-center gap-2 pr-1">
            {Object.entries(filterDefinitions).map(([name, options]) => (
              <ExamFilterDropdown key={name} label={name} options={options} selected={filterValues[name] ?? []} onChange={(values) => updateFilter(name, values)} accent={name === 'Exam type'} />
            ))}
            <Button size="sm" variant="secondary" onClick={() => setToast('Filters applied to the mock list.')} className="ml-1 h-9 shrink-0"><ListFilter className="mr-2" />Apply filter</Button>
            <button type="button" onClick={clearFilters} className="ml-2 shrink-0 text-sm font-medium text-gray-600 underline underline-offset-2 hover:text-[#071046]">Clear all</button>
            <Button onClick={() => setToast('Report area opened.')} className="ml-auto h-11 shrink-0 bg-[#ee5b00] px-5 text-white hover:bg-[#d44e00]">Report area</Button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-[310px]"><Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Type to search..." className="h-11 border-gray-200 bg-white pl-10" /></div>
            <Button variant="secondary" onClick={() => setAdvanced(true)} className="h-11 justify-start px-5 sm:justify-center"><SlidersHorizontal className="mr-2" />Advanced Search</Button>
          </div>
          <div className="flex items-center gap-3 self-end lg:self-auto">
            <ExamFilterDropdown label="Columns" options={columnOptions} selected={visibleColumns} onChange={setVisibleColumns} selectedText={`: ${visibleColumns.length} columns`} align="right" triggerClassName="h-11" />
            <Button size="icon" variant="outline" aria-label="Table view"><FileText /></Button>
          </div>
        </div>
      </section>

      {advanced && <AdvancedExamFilters onClose={() => setAdvanced(false)} />}
      <Card className="border-gray-200 bg-white shadow-sm"><CardContent className="p-0"><div className="overflow-x-auto"><table className="min-w-[1100px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs text-gray-600"><tr><th className="px-4 py-4"><SortableHeader label="Exam ID" active={sort.key === 'id'} direction={sort.direction} onClick={() => toggleSort('id')} /></th><th className="px-4 py-4"><SortableHeader label="Patient name" active={sort.key === 'name'} direction={sort.direction} onClick={() => toggleSort('name')} /></th><th className="px-4 py-4"><SortableHeader label="Patient ID" active={sort.key === 'patientId'} direction={sort.direction} onClick={() => toggleSort('patientId')} /></th><th className="px-4 py-4"><SortableHeader label="Reception" active={sort.key === 'date'} direction={sort.direction} onClick={() => toggleSort('date')} /></th><th className="px-4 py-4"><SortableHeader label="Unit" active={sort.key === 'unit'} direction={sort.direction} onClick={() => toggleSort('unit')} /></th><th className="px-4 py-4"><SortableHeader label="Modified by" active={sort.key === 'modifiedBy'} direction={sort.direction} onClick={() => toggleSort('modifiedBy')} /></th><th className="px-4 py-4"><SortableHeader label="Exam type" active={sort.key === 'type'} direction={sort.direction} onClick={() => toggleSort('type')} /></th><th className="px-4 py-4"><SortableHeader label="Summary" active={sort.key === 'result'} direction={sort.direction} onClick={() => toggleSort('result')} /></th><th className="px-4 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{visibleRows.map((exam) => { const report = reports.find((item) => item.examId === exam.id); return <tr key={exam.key} onClick={() => router.push(`/exams/${exam.id}`)} className="cursor-pointer transition-colors hover:bg-orange-50/70"><td className="px-4 py-3 font-semibold">{exam.id}</td><td className="px-4 py-3 font-medium text-[#177bd1]">{exam.name}</td><td className="px-4 py-3">{exam.patientId}</td><td className="px-4 py-3">{exam.date}</td><td className="px-4 py-3 text-[#177bd1]">{exam.unit}</td><td className="px-4 py-3">{exam.modifiedBy}</td><td className="px-4 py-3">{exam.type}</td><td className="px-4 py-3"><Status value={exam.result} /></td><td className="px-4 py-3"><div className="flex gap-1"><Button asChild size="icon" variant="ghost" onClick={(event) => event.stopPropagation()}><Link href={`/exams/${exam.id}`} aria-label="View exam"><Eye /></Link></Button>{report ? <Button asChild size="icon" variant="ghost" onClick={(event) => event.stopPropagation()}><Link href={`/reports/${report.id}`} aria-label="View report"><FileText /></Link></Button> : <Button size="icon" variant="ghost" disabled aria-label="Report unavailable"><FileText /></Button>}<Actions id={exam.id} onAction={setToast} onDelete={setExamToDelete} /><Button size="icon" variant="ghost" onClick={(event) => { event.stopPropagation(); setToast(`${exam.id} downloaded.`); }}><Download /></Button></div></td></tr>; })}</tbody></table>{!visibleRows.length && <p className="p-10 text-center text-sm text-gray-500">No exams match these filters.</p>}</div><TablePagination page={page} pageCount={pageCount} total={list.length} pageSize={pageSize} onPageChange={setPage} /></CardContent></Card>
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
      <ConfirmDialog open={Boolean(examToDelete)} title="Delete Exam" description="Are you sure you want to delete this exam? This action is permanent and the data cannot be recovered." onCancel={() => setExamToDelete(null)} onConfirm={() => { setToast(`${examToDelete} deleted from this mock list.`); setExamToDelete(null); }} />
    </div>
  );
}

function Status({ value }: { value: string }) { const color = value === 'Normal' ? 'bg-green-100 text-green-700' : value === 'Abnormal' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'; return <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>{value}</span>; }
function Actions({ id, onAction, onDelete }: { id: string; onAction: (text: string) => void; onDelete: (id: string) => void }) { const [open, setOpen] = React.useState(false); const choose = (name: string) => { setOpen(false); if (name === 'Delete') onDelete(id); else onAction(`${name} started for ${id}.`); }; const actions = [[PenLine, 'Sign report'], [Repeat2, 'Reassociate'], [UserRound, 'Assign to a doctor'], [Trash2, 'Delete'] ] as const; return <div className="relative"><Button size="icon" variant="ghost" onClick={(event) => { event.stopPropagation(); setOpen(!open); }}><MoreHorizontal /></Button>{open && <div onClick={(event) => event.stopPropagation()} className="absolute right-0 top-10 z-30 w-60 rounded-lg border border-gray-200 bg-white p-2 shadow-xl">{actions.map(([Icon, item], index) => <button key={item} onClick={() => choose(item)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium ${index === 0 ? 'bg-orange-50 text-[#ee5b00]' : item === 'Delete' ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}><Icon className="h-5 w-5" />{item}</button>)}</div>}</div>; }
