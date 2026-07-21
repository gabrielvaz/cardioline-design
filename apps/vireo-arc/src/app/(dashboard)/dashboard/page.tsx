import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Painel principal do Vireo Arc — Cardioline',
};

export default function DashboardPage() {
  return (
    <main
      id="dashboard-main"
      className="min-h-screen bg-background p-8"
    >
      <h1 className="text-3xl font-bold font-heading text-foreground">
        Dashboard
      </h1>
      <p className="text-muted-foreground mt-2">
        Em construção — Vireo Arc Dashboard
      </p>
    </main>
  );
}
