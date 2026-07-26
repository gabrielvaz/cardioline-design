"use client";

import { notFound } from "next/navigation";
import { usePrototypeData } from "@/lib/prototype-data";
import { ExamLoadingGate, ExamLoadingScreen } from "@/components/exams/exam-loading-gate";

/** Resolves an exam from the prototype store once it has hydrated. */
export function ExamPageLoader({ id }: { id: string }) {
  const { data, hydrated } = usePrototypeData();
  if (!hydrated) return <ExamLoadingScreen />;
  const exam = data.exams.find((item) => item.id === id);
  if (!exam) notFound();
  return <ExamLoadingGate exam={exam} />;
}
