import { ExamPageLoader } from '@/components/exams/exam-page-loader';

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExamPageLoader id={id} />;
}
