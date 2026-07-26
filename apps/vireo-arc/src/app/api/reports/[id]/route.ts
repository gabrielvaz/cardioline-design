import { reports } from '@/lib/mock-data';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = reports.find((item) => item.id === id);
  if (!report) return new Response('Report not found', { status: 404 });
  const body = `VIREO ARC — MOCK REPORT\n\n${report.type}\nPatient: ${report.patient}\nDate: ${report.date}\nStatus: ${report.status}\n\nThis document is mock data for UI demonstration only.`;
  return new Response(body, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${report.id}.pdf"` } });
}
