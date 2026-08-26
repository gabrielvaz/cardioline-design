import type { Report } from "@/lib/prototype-data";

/**
 * Builds the mock report file in the browser.
 *
 * This used to be an `/api/reports/[id]` route. The prototype is published as
 * a static export on GitHub Pages, which has no server to answer it, and the
 * route only ever stitched mock fields into a string — so the same document is
 * assembled client-side and handed to the browser as a Blob.
 */
export function downloadReport(report: Pick<Report, "id" | "type" | "patient" | "date" | "status">) {
  const body = [
    "VIREO ARK — MOCK REPORT",
    "",
    report.type,
    `Patient: ${report.patient}`,
    `Date: ${report.date}`,
    `Status: ${report.status}`,
    "",
    "This document is mock data for UI demonstration only.",
  ].join("\n");

  const url = URL.createObjectURL(new Blob([body], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.id}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
