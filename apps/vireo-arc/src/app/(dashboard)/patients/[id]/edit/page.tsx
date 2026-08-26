import { PatientEditLoader } from '@/components/patients/patient-edit-loader';
import { patients } from '@/lib/mock-data';

export function generateStaticParams() {
  return patients.map((patient) => ({ id: patient.id }));
}

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PatientEditLoader id={id} />;
}
