'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Hand, Maximize2, MousePointer2, Printer, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@cardioline/ui';
import { PrototypeToast } from '@/components/ui/prototype-toast';
import { usePrototypeData, type Report } from '@/lib/prototype-data';

const examInfo = [['Type', 'Holter'], ['Acquisition', '11/17/2022 9:53'], ['Reception', '11/17/2022 9:53'], ['Device', 'Walk400h (NG)'], ['Unit', 'Ambulatorio Salus'], ['Accession', '568'], ['Review date', '12/1/2022 7:09'], ['Reviewer', 'Leonella Panzacchi']];

export function ReportPdfViewer({ report }: { report: Report }) {
  const { updateReport } = usePrototypeData();
  const [zoom, setZoom] = React.useState(100);
  const [conclusion, setConclusion] = React.useState(report.conclusion ?? '');
  const [summary, setSummary] = React.useState(report.summary ?? 'Normal');
  const [toast, setToast] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [match, setMatch] = React.useState(1);
  const [tool, setTool] = React.useState<'pointer' | 'hand'>('pointer');
  const totalMatches = search.trim() ? 10 : 0;
  const stepMatch = (delta: number) => setMatch((current) => totalMatches ? ((current - 1 + delta + totalMatches) % totalMatches) + 1 : 1);
  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)] min-h-[720px] flex-col bg-[#f4f7fa]">
      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-3 py-2 sm:px-5">
        <div className="flex min-w-0 items-center gap-3"><Button asChild variant="ghost" size="sm"><Link href="/reports"><ArrowLeft className="mr-1.5 h-4 w-4" />Back</Link></Button><div className="min-w-0"><h1 className="truncate text-xl font-bold text-slate-800">{report.patient}</h1><p className="text-xs text-slate-500">Captured: {report.date} 13:59 · Reviewed: 01/03/2023 19:32</p></div></div>
        <div className="hidden items-center gap-5 xl:flex"><Metric label="Patient ID" value={report.patientId.replace('P-', '312356')} /><Metric label="Age" value="46" /><Metric label="Gender" value="Male" /><Metric label="Weight" value="80 kg" /><Metric label="Height" value="180 cm" /><Metric label="Pressure" value="98" /></div>
        <div className="flex gap-1"><Button size="icon" variant="ghost" aria-label="Print report" onClick={() => window.print()}><Printer /></Button><Button asChild size="icon" variant="ghost" aria-label="Download report"><a href={`/api/reports/${report.id}`} download><Download /></a></Button></div>
      </header>
      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="min-h-0 overflow-auto p-5 sm:p-7">
          <article className="mx-auto min-h-[810px] w-full max-w-[57rem] bg-white p-7 shadow-sm sm:p-11" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', marginBottom: `${(zoom - 100) * 5}px` }}>
            <div className="ml-auto max-w-[14rem] text-right text-[10px] leading-tight text-slate-400">Cardioline Report First Row<br />Cardioline Report Second Row<br />Cardioline Report Third Row<br />Cardioline Report Fourth Row</div>
            <div className="mt-3 border-t-4 border-[#e87843] pt-4"><h2 className="text-3xl font-light text-[#e87843]">Report Holter</h2></div>
            <SectionTitle>Patient details</SectionTitle>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-[#f5f1ee] p-4 text-xs sm:grid-cols-5"><Detail label="Name" value={report.patient.toUpperCase()} /><Detail label="Gender" value="Female" /><Detail label="Birth date" value="04/02/1945" /><Detail label="Age" value="77A" /><Detail label="ID" value="22 913 est." /><Detail label="Second ID" value="—" /><Detail label="E-mail" value="—" /><Detail label="Phone" value="—" /><Detail label="Date" value="17/11/2022" /><Detail label="Height" value="—" /><Detail label="Weight" value="—" /><Detail label="Diagnostic request" value="—" /><Detail label="Therapy" value="—" /><Detail label="Pathology notes" value="—" /></div>
            <SectionTitle>Conclusions</SectionTitle>
            <div className="flex h-[24rem] items-center justify-center border border-[#edf2dc] text-sm text-slate-300">Report page preview</div>
          </article>
        </section>
        <aside className="flex min-h-0 flex-col border-t border-slate-100 bg-[#f7f9fb] p-4 xl:border-l xl:border-t-0">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">Exam info</h2>
          <dl className="text-sm">{examInfo.map(([label, value], index) => <div key={label} className={`flex justify-between gap-4 px-2 py-2 ${index % 2 === 0 ? 'bg-slate-200/65' : ''}`}><dt className="text-slate-600">{label}</dt><dd className="text-right font-medium text-slate-700">{value}</dd></div>)}</dl>
          <div className="mt-8 flex items-center justify-between"><Label className="text-xs uppercase tracking-wide text-slate-600">Conclusions</Label><button type="button" onClick={() => setConclusion('Holter monitoring with sinus rhythm. No significant arrhythmias identified.')} className="text-xs font-medium text-[#177bd1] hover:underline">Pick a template</button></div>
          <textarea value={conclusion} onChange={(event) => setConclusion(event.target.value)} placeholder="Type here" className="mt-2 min-h-28 w-full rounded-md border border-slate-200 bg-white p-3 text-sm outline-none focus:border-[#ee5b00]" />
          <div className="mt-6 space-y-2"><Label htmlFor="report-summary" className="text-xs uppercase tracking-wide text-slate-600">Summary</Label><Select value={summary} onValueChange={setSummary}><SelectTrigger id="report-summary" className="h-10 w-full"><SelectValue /></SelectTrigger><SelectContent>{['Normal', 'Borderline', 'Abnormal', 'Pending review'].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>
          <Button onClick={() => { updateReport(report.id, { conclusion, summary }); setToast(`Report saved as ${summary}.`); }} className="mt-auto w-full bg-primary text-white">Save</Button>
        </aside>
      </div>
      <footer className="flex shrink-0 flex-wrap items-center gap-2 border-t border-slate-100 bg-white px-4 py-2 text-slate-500"><div className="relative"><Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" /><Input value={search} onChange={(event) => { setSearch(event.target.value); setMatch(1); }} placeholder="Search in report" className="h-9 w-40 pl-8" /></div><Button size="icon" variant="ghost" disabled={!totalMatches} onClick={() => stepMatch(-1)} aria-label="Previous match"><ArrowLeft /></Button><span className="min-w-[3.5rem] text-center text-sm tabular-nums">{totalMatches ? `${match} / ${totalMatches}` : '0 / 0'}</span><Button size="icon" variant="ghost" disabled={!totalMatches} onClick={() => stepMatch(1)} aria-label="Next match"><ArrowLeft className="rotate-180" /></Button><span className="mx-1 h-6 w-px bg-slate-200" /><Button size="icon" variant="ghost" onClick={() => setZoom((value) => Math.min(140, value + 10))} aria-label="Zoom in"><ZoomIn /></Button><Button size="icon" variant="ghost" onClick={() => setZoom((value) => Math.max(70, value - 10))} aria-label="Zoom out"><ZoomOut /></Button><span className="ml-1 rounded-md border border-slate-200 px-3 py-2 text-sm tabular-nums">{zoom}%</span><Button size="icon" variant="ghost" onClick={() => setZoom(100)} aria-label="Fit to page"><Maximize2 /></Button><span className="mx-1 h-6 w-px bg-slate-200" /><Button size="icon" variant={tool === 'pointer' ? 'secondary' : 'ghost'} aria-pressed={tool === 'pointer'} onClick={() => setTool('pointer')} aria-label="Pointer tool"><MousePointer2 /></Button><Button size="icon" variant={tool === 'hand' ? 'secondary' : 'ghost'} aria-pressed={tool === 'hand'} onClick={() => setTool('hand')} aria-label="Hand tool"><Hand /></Button></footer>
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="text-center"><strong className="block text-sm text-slate-800">{value}</strong><span className="text-xs text-slate-400">{label}</span></div>; }
function SectionTitle({ children }: { children: React.ReactNode }) { return <h3 className="mt-4 flex items-center gap-2 text-2xl font-light text-[#e87843]"><span>{children}</span><span className="h-px flex-1 bg-[#e87843]" /></h3>; }
function Detail({ label, value }: { label: string; value: string }) { return <div><dt className="mb-1 font-medium text-[#e87843]">{label}</dt><dd className="font-semibold text-slate-700">{value}</dd></div>; }
