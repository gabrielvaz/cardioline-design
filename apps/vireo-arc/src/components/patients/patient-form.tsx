'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@cardioline/ui';
import { usePrototypeData } from '@/lib/prototype-data';

type PatientFormProps = { mode: 'create' | 'edit'; patientId?: string; patientName?: string };
const personalFields = [['first-name', 'First name (mandatory)', 'Type here', 'text', true], ['last-name', 'Last name', 'Type here', 'text', false], ['phone', 'Phone', 'Type here', 'tel', false], ['patient-id', 'Patient ID', 'Type here', 'text', false], ['patient-id-2', 'Patient ID 2', 'Type here', 'text', false], ['email', 'Email', 'Type here', 'email', false], ['birthday', 'Birthday', 'dd/mm/yy', 'text', false], ['ethnicity', 'Ethnicity', 'Type here', 'text', false], ['age', 'Age', 'Type here', 'number', false], ['weight', 'Weight (kg)', 'Type here', 'number', false], ['height', 'Height (cm)', 'Type here', 'number', false], ['blood-pressure', 'Blood pressure', 'Type here', 'text', false]] as const;
const locationFields = [['address', 'Address', 'Type here'], ['city', 'City', 'Type here'], ['province', 'Province', 'dd/mm/yy'], ['region', 'Region', 'Type here'], ['country', 'Country', 'Type here']] as const;

function patientValues(patientId: string, patientName: string): Record<string, string> {
  const [firstName = '', ...lastName] = patientName.split(' ');
  return { 'first-name': firstName, 'last-name': lastName.join(' '), phone: '0362 209391012', 'patient-id': patientId, 'patient-id-2': '43397744', email: `${patientName.toLowerCase().replaceAll(' ', '')}@email.com`, birthday: '05/02/1982', ethnicity: 'White', age: '46', weight: '80', height: '180', 'blood-pressure': '98', address: 'Via Linz Spini di Gardolo, 151', city: 'Gardolo', province: 'Trento', region: 'Trentino-Alto Adige', country: 'Italy' };
}

/** Reads the display name and date of birth from the submitted form data. */
function readPatientFields(form: HTMLFormElement, prefix = '') {
  const data = new FormData(form);
  const value = (key: string) => String(data.get(`${prefix}${key}`) ?? '').trim();
  const name = [value('first-name'), value('last-name')].filter(Boolean).join(' ');
  return { name, dob: value('birthday') };
}

export function PatientForm({ mode, patientId = 'P-10029', patientName = 'Andrea Gallo' }: PatientFormProps) {
  const router = useRouter(); const editing = mode === 'edit';
  const { addPatient, updatePatient } = usePrototypeData();
  const values: Record<string, string> = editing ? patientValues(patientId, patientName) : {};
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name, dob } = readPatientFields(event.currentTarget);
    if (editing) {
      updatePatient(patientId, { ...(name ? { name } : {}), ...(dob ? { dob } : {}) });
      router.push(`/patients/${patientId}`);
      return;
    }
    const patient = addPatient({ name: name || 'Unnamed patient', dob: dob || '—' });
    router.push(`/patients/${patient.id}`);
  };
  return <form onSubmit={onSubmit} className="space-y-7"><div><p className="text-sm font-medium text-gray-700">Patients <span className="px-1 text-gray-400">›</span> {editing ? 'Edit Patient' : 'Add Patient'}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-[#071046]">{editing ? 'Edit Patient' : 'Create Patient'}</h1></div><Card className="border-gray-200 bg-white shadow-sm"><CardContent className="p-7"><h2 className="mb-7 text-base font-bold text-gray-900">Personal Info</h2><div className="grid gap-x-11 gap-y-6 md:grid-cols-2 xl:grid-cols-3">{personalFields.map(([id, label, placeholder, type, required]) => <Field key={id} id={id} label={label} placeholder={placeholder} type={type} required={required} value={values[id]} />)}<div className="space-y-2"><Label htmlFor="gender">Gender</Label><Select name="gender" defaultValue={editing ? 'Male' : undefined}><SelectTrigger id="gender" className="h-10 w-full"><SelectValue placeholder="Select an option" /></SelectTrigger><SelectContent>{['Female', 'Male', 'Other', 'Not specified'].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div></div></CardContent></Card><Card className="border-gray-200 bg-white shadow-sm"><CardContent className="p-7"><h2 className="mb-7 text-base font-bold text-gray-900">Location Information</h2><div className="grid gap-x-11 gap-y-6 md:grid-cols-2 xl:grid-cols-3">{locationFields.map(([id, label, placeholder]) => <Field key={id} id={id} label={label} placeholder={placeholder} value={values[id]} />)}</div></CardContent></Card><div className="flex justify-end gap-3 pb-3"><Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button><Button type="submit" className="bg-primary text-white">{editing ? 'Save changes' : 'Create patient'}</Button></div></form>;
}

export function PatientEditDialog({ open, onOpenChange, patientId, patientName, onSaved }: { open: boolean; onOpenChange: (open: boolean) => void; patientId: string; patientName: string; onSaved?: () => void }) {
  const { updatePatient } = usePrototypeData();
  const values = React.useMemo(() => patientValues(patientId, patientName), [patientId, patientName]);
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name, dob } = readPatientFields(event.currentTarget, 'exam-edit-');
    updatePatient(patientId, { ...(name ? { name } : {}), ...(dob ? { dob } : {}) });
    onSaved?.();
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[calc(100vh-2rem)] max-w-4xl overflow-y-auto"><form onSubmit={onSubmit}><DialogHeader><DialogTitle>Edit patient</DialogTitle><DialogDescription>Update the mock patient details associated with this examination.</DialogDescription></DialogHeader><div className="mt-6 space-y-7"><section><h2 className="mb-5 text-base font-bold text-foreground">Personal Info</h2><div className="grid gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-3">{personalFields.map(([id, label, placeholder, type, required]) => <Field key={id} id={`exam-edit-${id}`} label={label} placeholder={placeholder} type={type} required={required} value={values[id]} />)}<div className="space-y-2"><Label htmlFor="exam-edit-gender">Gender</Label><Select defaultValue="Male"><SelectTrigger id="exam-edit-gender" className="h-10 w-full"><SelectValue placeholder="Select an option" /></SelectTrigger><SelectContent>{['Female', 'Male', 'Other', 'Not specified'].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div></div></section><section className="border-t border-border pt-6"><h2 className="mb-5 text-base font-bold text-foreground">Location Information</h2><div className="grid gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-3">{locationFields.map(([id, label, placeholder]) => <Field key={id} id={`exam-edit-${id}`} label={label} placeholder={placeholder} value={values[id]} />)}</div></section></div><DialogFooter className="mt-7"><Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit">Save changes</Button></DialogFooter></form></DialogContent></Dialog>;
}
function Field({ id, label, placeholder, type = 'text', required = false, value }: { id: string; label: string; placeholder: string; type?: string; required?: boolean; value?: string }) { return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} name={id} type={type} required={required} defaultValue={value} placeholder={placeholder} className="h-10 border-gray-200 bg-white placeholder:text-gray-400 focus-visible:ring-[#ee5b00]" /></div>; }
