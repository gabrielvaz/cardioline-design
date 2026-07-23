import { exams } from '@/lib/mock-data';
import { ExamLoadingGate } from '@/components/exams/exam-loading-gate';
export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const exam = exams.find((item) => item.id === id) ?? exams[0]; return <ExamLoadingGate exam={exam} />; }
