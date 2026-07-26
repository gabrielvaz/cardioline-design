"use client";

import { notFound } from "next/navigation";
import { usePrototypeData } from "@/lib/prototype-data";
import { ReportPdfViewer } from "@/components/reports/report-pdf-viewer";
import { RecordSkeleton } from "@/components/ui/record-skeleton";

/** Resolves a report from the prototype store once it has hydrated. */
export function ReportLoader({ id }: { id: string }) {
  const { data, hydrated } = usePrototypeData();
  if (!hydrated) return <RecordSkeleton className="-m-6 p-6" />;
  const report = data.reports.find((item) => item.id === id);
  if (!report) notFound();
  return <ReportPdfViewer key={report.id} report={report} />;
}
