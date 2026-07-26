"use client";

import { notFound } from "next/navigation";
import { usePrototypeData } from "@/lib/prototype-data";
import { PatientForm } from "@/components/patients/patient-form";
import { RecordSkeleton } from "@/components/ui/record-skeleton";

/** Resolves the patient being edited from the prototype store once hydrated. */
export function PatientEditLoader({ id }: { id: string }) {
  const { data, hydrated } = usePrototypeData();
  if (!hydrated) return <RecordSkeleton />;
  const patient = data.patients.find((item) => item.id === id);
  if (!patient) notFound();
  return <PatientForm mode="edit" patientId={patient.id} patientName={patient.name} />;
}
