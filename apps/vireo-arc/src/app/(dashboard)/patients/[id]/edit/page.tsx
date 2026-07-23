import { PatientForm } from '@/components/patients/patient-form';
import { patients } from '@/lib/mock-data';
export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const patient = patients.find((item) => item.id === id) ?? patients[0]; return <PatientForm mode="edit" patientId={patient.id} patientName={patient.name} />; }
