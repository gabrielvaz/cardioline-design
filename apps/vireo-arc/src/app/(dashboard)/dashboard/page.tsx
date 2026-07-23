import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { PageHeader } from "@/components/ui/page-header";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of patient exams and recent activity." />
      <DashboardOverview />
    </div>
  );
}
