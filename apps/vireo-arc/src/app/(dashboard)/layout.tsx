import * as React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PrototypeDataProvider } from '@/lib/prototype-data';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrototypeDataProvider>
      <DashboardShell>{children}</DashboardShell>
    </PrototypeDataProvider>
  );
}
