import * as React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PrototypeDataProvider } from '@/lib/prototype-data';
import { RoleGuard } from '@/components/layout/role-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrototypeDataProvider>
      <RoleGuard>
        <DashboardShell>{children}</DashboardShell>
      </RoleGuard>
    </PrototypeDataProvider>
  );
}
