import { PatientDetailsLoader } from '@/components/patients/patient-details-loader';

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PatientDetailsLoader id={id} />;
}
