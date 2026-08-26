import { ReportLoader } from '@/components/reports/report-loader';
import { reports } from '@/lib/mock-data';

export function generateStaticParams() {
  return reports.map((report) => ({ id: report.id }));
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportLoader id={id} />;
}
