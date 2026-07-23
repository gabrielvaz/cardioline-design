import { ReportPdfViewer } from '@/components/reports/report-pdf-viewer';
import { reports } from '@/lib/mock-data';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = reports.find((item) => item.id === id) ?? reports[0];
  return <ReportPdfViewer report={report} />;
}
