import { PatientDetailView } from '@/components/patients/patient-detail-view';
import { patients } from '@/lib/mock-data';

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = patients.find((item) => item.id === id) ?? patients[0];
  return <PatientDetailView patient={patient} />;
}
