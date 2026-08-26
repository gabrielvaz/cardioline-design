import { PatientDetailsLoader } from '@/components/patients/patient-details-loader';
import { patients } from '@/lib/mock-data';

export function generateStaticParams() {
  return patients.map((patient) => ({ id: patient.id }));
}

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PatientDetailsLoader id={id} />;
}
