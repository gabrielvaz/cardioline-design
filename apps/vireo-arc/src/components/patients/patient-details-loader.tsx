"use client";

import { notFound } from "next/navigation";
import { usePrototypeData } from "@/lib/prototype-data";
import { PatientDetailView } from "@/components/patients/patient-detail-view";
import { RecordSkeleton } from "@/components/ui/record-skeleton";

/** Resolves a patient from the prototype store once it has hydrated. */
export function PatientDetailsLoader({ id }: { id: string }) {
  const { data, hydrated } = usePrototypeData();
  if (!hydrated) return <RecordSkeleton />;
  const patient = data.patients.find((item) => item.id === id);
  if (!patient) notFound();
  return <PatientDetailView key={patient.id} patient={patient} />;
}
