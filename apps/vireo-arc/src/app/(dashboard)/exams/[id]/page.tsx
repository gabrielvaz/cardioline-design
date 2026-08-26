import { ExamPageLoader } from '@/components/exams/exam-page-loader';
import { exams } from '@/lib/mock-data';

/* Static export needs the id set up front. Records created in the browser
   live only in localStorage, so their detail pages are not pre-rendered. */
export function generateStaticParams() {
  return exams.map((exam) => ({ id: exam.id }));
}

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExamPageLoader id={id} />;
}
