'use client';

import * as React from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, ChevronLeft, ChevronUp, Download, Edit3, FileText, Image, Printer } from 'lucide-react';
import { Button, cn, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@cardioline/ui';
import { PrototypeToast } from '@/components/ui/prototype-toast';
import { pageSubtitleClassName, pageTitleClassName } from '@/components/ui/page-header';
import { PatientEditDialog } from '@/components/patients/patient-form';

type Exam = { id: string; patientId: string; name: string; type: string; date: string; result: string };
const leads = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
const measurements = ['R (ms)', 'S (ms)', 'Q Amp (mV)', 'R Amp (mV)', 'ST (ms)', 'QT (ms)'];
const globals = [['Cardiac frequency (BPM)', '72'], ['P duration (ms)', '120'], ['PR interval (ms)', '160'], ['QRS duration (ms)', '100'], ['QT interval (ms)', '360'], ['QTc Bazett (ms)', '311'], ['QTc Fridericia (ms)', '344']];
const clinicalRows = ['Study reason', 'Notes', 'Medical history', 'Medications', 'Technician', 'Number of rest...'];

/** Tall enough to show all measurement rows without an internal scrollbar by default. */
const DEFAULT_MEASUREMENTS_HEIGHT = 440;
const MIN_MEASUREMENTS_HEIGHT = 160;
const MAX_MEASUREMENTS_HEIGHT = 640;

export function EcgViewer({ exam }: { exam: Exam }) {
  const [showMeasurements, setShowMeasurements] = React.useState(true);
  const [measurementsHeight, setMeasurementsHeight] = React.useState(DEFAULT_MEASUREMENTS_HEIGHT);
  const [isResizingMeasurements, setIsResizingMeasurements] = React.useState(false);
  const [summary, setSummary] = React.useState(exam.result === 'Abnormal' ? 'Abnormal' : 'Normal');
  const [conclusion, setConclusion] = React.useState('');
  const [templateOpen, setTemplateOpen] = React.useState(false);
  const [saveFormatOpen, setSaveFormatOpen] = React.useState(false);
  const [patientEditOpen, setPatientEditOpen] = React.useState(false);
  const [asideCollapsed, setAsideCollapsed] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const handleMeasurementsResizeStart = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const startY = event.clientY;
    const startHeight = measurementsHeight;
    setIsResizingMeasurements(true);
    const handleMove = (moveEvent: MouseEvent) => {
      const next = startHeight + (moveEvent.clientY - startY);
      setMeasurementsHeight(Math.min(MAX_MEASUREMENTS_HEIGHT, Math.max(MIN_MEASUREMENTS_HEIGHT, next)));
    };
    const handleUp = () => {
      setIsResizingMeasurements(false);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [measurementsHeight]);
  return <div className="-m-6 min-h-[calc(100vh-4rem)] bg-white text-slate-700">
    <header className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3">
      <div className="flex min-w-0 items-center gap-2"><Button asChild variant="ghost" size="sm" className="text-slate-600"><Link href="/exams"><ArrowLeft className="mr-1" />Back</Link></Button><div className="ml-4 min-w-0"><div className="flex items-center gap-2"><h1 className={`truncate ${pageTitleClassName}`}>{exam.name}</h1><Button size="icon" variant="ghost" aria-label={`Edit ${exam.name}`} className="h-8 w-8 shrink-0" onClick={() => setPatientEditOpen(true)}><Edit3 className="h-4 w-4" /></Button></div><p className={pageSubtitleClassName}>Captured: {exam.date} · Reviewed: Oct 25, 2026 09:32</p></div></div>
      <div className="hidden items-center gap-6 text-center lg:flex">{[['31235674','Patient ID'],['46','Age'],['Male','Gender'],['80 kg','Weight'],['180 cm','Height'],['98','Pressure']].map(([value,label]) => <div key={label}><p className="text-sm font-bold text-slate-800">{value}</p><p className="text-[11px] text-slate-400">{label}</p></div>)}<Button size="icon" variant="ghost" aria-label="Print ECG" onClick={() => window.print()}><Printer /></Button><Button size="icon" variant="ghost" aria-label="Save ECG" onClick={() => setSaveFormatOpen(true)}><Download /></Button></div>
    </header>
    <div
      className={cn(
        'grid min-h-[calc(100vh-8.75rem)] grid-cols-1 transition-[grid-template-columns] duration-300 ease-in-out xl:h-[calc(100dvh-8.75rem)] xl:min-h-0',
        asideCollapsed ? 'xl:grid-cols-[minmax(0,1fr)_44px]' : 'xl:grid-cols-[minmax(0,1fr)_400px]',
      )}
    >
      <main className="flex min-h-[calc(100dvh-8.75rem)] min-w-0 flex-col xl:min-h-0"><div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-white px-3 py-2"><Control label="Compare" /><Control label="Format: 12×1" /><Control label="mm/mV: 10" /><Control label="mm/s: 25" /><Control label="Muscular filter: on" /><button type="button" onClick={() => setShowMeasurements((visible) => !visible)} aria-expanded={showMeasurements} aria-controls="ecg-measurements" className="ml-2 inline-flex h-9 items-center gap-2 rounded-md px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-orange-50 hover:text-[#ee5b00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5b00]/30"><ChevronUp className={cn('h-4 w-4 shrink-0 transition-transform duration-300 ease-out', !showMeasurements && 'rotate-180')} /> <span>{showMeasurements ? 'Hide measurements' : 'Show measurements'}</span></button></div>
        <div
          id="ecg-measurements"
          style={{ height: showMeasurements ? measurementsHeight : 0 }}
          className={cn('shrink-0 overflow-hidden', !isResizingMeasurements && 'transition-[height] duration-300 ease-in-out motion-reduce:transition-none')}
        >
          <MeasurementTable />
        </div>
        {showMeasurements && (
          <div
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize the leads table"
            aria-valuenow={measurementsHeight}
            aria-valuemin={MIN_MEASUREMENTS_HEIGHT}
            aria-valuemax={MAX_MEASUREMENTS_HEIGHT}
            onMouseDown={handleMeasurementsResizeStart}
            className={cn('group relative h-2 shrink-0 cursor-row-resize touch-none select-none bg-slate-100 transition-colors hover:bg-orange-100', isResizingMeasurements && 'bg-orange-100')}
          >
            <div className={cn('absolute left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300 transition-colors group-hover:bg-[#ee5b00]', isResizingMeasurements && 'bg-[#ee5b00]')} />
          </div>
        )}
        <div className="border-y border-slate-200 bg-white px-5 py-2 text-sm text-slate-600">Acquired at 25/06/2024 at 12:10:03 · Not confirmed · Trial test</div>
        <Waveform fillAvailableHeight />
      </main>
      <aside className={cn('relative overflow-hidden border-l border-slate-100 bg-white', asideCollapsed ? 'p-0' : 'p-4')}>
        <button
          type="button"
          onClick={() => setAsideCollapsed((collapsed) => !collapsed)}
          aria-label={asideCollapsed ? 'Expand panel' : 'Collapse panel'}
          className={cn(
            'absolute top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-orange-50 hover:text-[#ee5b00]',
            asideCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-3',
          )}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform duration-300', asideCollapsed && 'rotate-180')} />
        </button>
        {!asideCollapsed && (
          <div className="pt-12"><ClinicalData /><section className="mt-6"><h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">Global measurements</h2><dl className="text-sm">{globals.map(([label,value], index) => <div key={label} className={`flex cursor-default justify-between px-2 py-2 transition-colors hover:bg-[#d8effc] ${index % 2 === 0 ? 'bg-slate-100' : ''}`}><dt>{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl></section><section className="mt-6"><div className="flex items-center justify-between"><h2 className="text-xs font-bold uppercase tracking-wide text-slate-600">Conclusions</h2><button onClick={() => setTemplateOpen(true)} className="text-xs text-[#ee5b00] hover:underline">Pick a template</button></div><textarea value={conclusion} onChange={(event) => setConclusion(event.target.value)} placeholder="Type here" className="mt-2 min-h-28 w-full rounded-md border border-slate-200 bg-white p-3 text-sm outline-none focus:border-[#ee5b00]" /><div className="mt-4 space-y-2"><Label htmlFor="summary">Summary</Label><Select value={summary} onValueChange={setSummary}><SelectTrigger id="summary" className="h-10 w-full"><SelectValue /></SelectTrigger><SelectContent>{['Normal', 'Borderline', 'Abnormal', 'Pending Review'].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div><Button onClick={() => setToast('ECG interpretation saved.')} className="mt-5 w-full bg-primary text-white">Save</Button></section></div>
        )}
      </aside>
    </div><ConclusionTemplateDialog open={templateOpen} onOpenChange={setTemplateOpen} onSelect={(template) => setConclusion(template)} /><EcgSaveFormatDialog open={saveFormatOpen} onOpenChange={setSaveFormatOpen} onSave={(format) => setToast(`${exam.id} ECG saved as ${format}.`)} /><PatientEditDialog open={patientEditOpen} onOpenChange={setPatientEditOpen} patientId={exam.patientId} patientName={exam.name} onSaved={() => setToast(`${exam.name}'s patient details saved.`)} /><PrototypeToast message={toast} onClose={() => setToast(null)} />
    <style jsx global>{`
      @media (min-width: 1280px) and (min-height: 900px) {
        .ecg-measurements-scroll {
          padding: 1.5rem 1.25rem;
        }

        .ecg-measurements-table thead th {
          padding-top: 1.5rem;
          padding-bottom: 0.9rem;
        }

        .ecg-measurements-table tbody th,
        .ecg-measurements-table tbody td {
          padding-top: 0.85rem;
          padding-bottom: 0.85rem;
        }

        .ecg-waveform-surface {
          min-height: min(62vh, 58rem);
        }

        .ecg-lead-row {
          height: clamp(5.5rem, 9vh, 9rem);
        }
      }

      .ecg-waveform-expanded .ecg-lead-row {
        height: auto;
        min-height: 4rem;
        flex: 1 1 0%;
      }
    `}</style>
  </div>;
}
function Control({ label }: { label: string }) {
  const choices = label.startsWith('Compare') ? ['Compare', 'None', 'Previous exam'] : label.startsWith('Format') ? ['Format: 12×1', 'Format: 6×2', 'Format: 3×4'] : label.startsWith('mm/mV') ? ['mm/mV: 10', 'mm/mV: 5', 'mm/mV: 20'] : label.startsWith('mm/s') ? ['mm/s: 25', 'mm/s: 50'] : ['Muscular filter: on', 'Muscular filter: off'];
  const [value, setValue] = React.useState(label);
  return <Select value={value} onValueChange={setValue}><SelectTrigger aria-label={label.split(':')[0]} className="min-w-[104px]"><SelectValue /></SelectTrigger><SelectContent>{choices.map((choice) => <SelectItem key={choice} value={choice}>{choice}</SelectItem>)}</SelectContent></Select>;
}
function MeasurementTable() {
  const [hovered, setHovered] = React.useState<{ row: number; col: number } | null>(null);
  const rowHighlight = 'bg-[#fff4e8] dark:bg-[#242d3f]';
  const columnHighlight = 'bg-[#ffe4c7] dark:bg-[#273b55]';
  const intersectionHighlight = 'bg-[#ffd1a0] dark:bg-[#3a4d6b]';
  return <div className="ecg-measurements-scroll h-full overflow-auto bg-white px-3 py-5"><table className="ecg-measurements-table min-w-[920px] w-full border-separate border-spacing-0 text-center text-sm"><thead className="text-xs font-bold text-slate-500"><tr><th className="w-24 px-3 pb-3 pt-5 text-left"></th>{leads.map((lead, col) => <th key={lead} onMouseEnter={() => setHovered({ row: -1, col })} onMouseLeave={() => setHovered(null)} className={`cursor-default px-3 pb-3 pt-5 transition-colors ${hovered?.col === col ? columnHighlight : ''}`}>{lead}</th>)}</tr></thead><tbody>{measurements.map((metric, row) => <tr key={metric} className="border-t border-slate-200">{/* The leading cell participates in the row highlight just like a list row. */}<th onMouseEnter={() => setHovered({ row, col: -1 })} onMouseLeave={() => setHovered(null)} className={`cursor-default whitespace-nowrap border-t border-slate-200 px-3 py-2 text-left font-medium text-slate-600 transition-colors ${hovered?.row === row ? rowHighlight : ''}`}>{metric}</th>{leads.map((lead, col) => <td key={lead} onMouseEnter={() => setHovered({ row, col })} onMouseLeave={() => setHovered(null)} className={`cursor-default border-t border-slate-200 py-2 text-slate-600 transition-colors ${hovered?.row === row && hovered?.col === col ? intersectionHighlight : hovered?.col === col ? columnHighlight : hovered?.row === row ? rowHighlight : ''}`}>{row === 2 ? (col % 2 ? '0.57' : '0.42') : 57}</td>)}</tr>)}</tbody></table></div>;
}
function Waveform({ fillAvailableHeight = false }: { fillAvailableHeight?: boolean }) { const pattern = '0,56 30,56 38,51 45,62 52,56 58,17 64,92 70,56 100,56 110,48 120,56 140,56'; return <div className={cn('ecg-waveform ecg-waveform-surface relative min-h-[520px] overflow-auto p-5', fillAvailableHeight && 'ecg-waveform-expanded flex flex-1 flex-col')}>{['aVF','V1','V2','V3','V4','V5'].map((lead,index) => <div key={lead} className={cn('ecg-lead-row relative min-w-[1160px]', fillAvailableHeight ? 'flex-1' : 'h-20')}><span className="absolute left-0 top-1 text-xs font-bold text-slate-700">{lead}</span><svg className="h-full w-full text-slate-600 dark:text-slate-200" viewBox="0 0 1200 112" preserveAspectRatio="none"><polyline points={Array.from({ length: 9 }, (_, i) => pattern.split(' ').map((point) => { const [x,y] = point.split(',').map(Number); return `${x + i * 140},${y + index * (index % 2 ? 0 : 1)}`; }).join(' ')).join(' ')} fill="none" stroke="currentColor" strokeWidth="1.4" /></svg></div>)}</div>; }
function ClinicalData() { const [editing, setEditing] = React.useState<string | null>(null); const [values, setValues] = React.useState<Record<string,string>>({}); return <section className="text-sm">{clinicalRows.map((label,index) => <div key={label} onClick={() => setEditing(label)} className={`flex min-h-9 cursor-pointer items-center justify-between px-2 py-2 transition-colors hover:bg-[#d8effc] dark:hover:bg-[#26364a] ${index % 2 === 0 ? 'bg-slate-100' : ''}`}><span>{label}</span>{editing === label ? <Input autoFocus value={values[label] ?? 'Lorem ipsum'} onClick={(event) => event.stopPropagation()} onChange={(event) => setValues({ ...values, [label]: event.target.value })} onBlur={() => setEditing(null)} className="h-7 w-40 bg-white text-xs" /> : <span className="flex items-center gap-3 text-slate-600">{values[label] ?? 'Lorem ipsum'}<button onClick={(event) => { event.stopPropagation(); setEditing(label); }} aria-label={`Edit ${label}`} className="hover:text-[#ee5b00]"><Edit3 className="h-4 w-4" /></button></span>}</div>)}</section>; }

function EcgSaveFormatDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; onSave: (format: string) => void }) {
  const [format, setFormat] = React.useState('PDF report');
  const formats = [
    { value: 'PDF report', label: 'PDF report', description: 'Printable clinical report', icon: FileText },
    { value: 'PNG image', label: 'PNG image', description: 'High-resolution waveform image', icon: Image },
    { value: 'DICOM waveform', label: 'DICOM waveform', description: 'Structured waveform data', icon: Activity },
  ];
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Save ECG</DialogTitle><DialogDescription>Choose the file format for this examination.</DialogDescription></DialogHeader><div className="mt-6"><p id="ecg-save-format-label" className="mb-2 text-sm font-medium text-foreground">File format</p><div role="radiogroup" aria-labelledby="ecg-save-format-label" className="space-y-3">{formats.map((option) => { const Icon = option.icon; const selected = format === option.value; return <Button key={option.value} type="button" variant="outline" role="radio" aria-checked={selected} onClick={() => setFormat(option.value)} className={cn('h-auto min-h-20 w-full flex-row items-center justify-start gap-4 whitespace-normal p-4 text-left transition-colors', selected ? 'border-primary bg-primary/10 text-foreground hover:bg-primary/15' : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/60')}><span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}><Icon className="h-4 w-4" /></span><span><span className="block text-sm font-semibold">{option.label}</span><span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">{option.description}</span></span></Button>; })}</div></div><DialogFooter className="mt-7"><Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="button" onClick={() => { onSave(format); onOpenChange(false); }}>Save examination</Button></DialogFooter></DialogContent></Dialog>;
}

function ConclusionTemplateDialog({ open, onOpenChange, onSelect }: { open: boolean; onOpenChange: (open: boolean) => void; onSelect: (template: string) => void }) {
  const templates = [{ name: 'Normal sinus rhythm', text: 'Normal sinus rhythm. No acute ST-T changes.' }, { name: 'Borderline ECG', text: 'Borderline ECG. Clinical correlation is recommended.' }, { name: 'Abnormal ECG', text: 'Abnormal ECG. Further clinical assessment is recommended.' }];
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Conclusion templates</DialogTitle><DialogDescription>Select a template to insert into the conclusions field.</DialogDescription></DialogHeader><div className="space-y-2">{templates.map((template) => <button key={template.name} type="button" onClick={() => { onSelect(template.text); onOpenChange(false); }} className="w-full rounded-lg border border-slate-200 p-4 text-left transition-colors hover:border-orange-200 hover:bg-orange-50"><p className="font-semibold text-[#071046]">{template.name}</p><p className="mt-1 text-sm text-slate-500">{template.text}</p></button>)}</div><DialogFooter><Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button></DialogFooter></DialogContent></Dialog>;
}
