"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Sidebar, type SidebarMode } from "./sidebar";
import { Header } from "./header";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExamView = /^\/exams\/[^/]+/.test(pathname);
  const isReportView = /^\/reports\/[^/]+/.test(pathname);
  const routeMode: SidebarMode | null = isExamView
    ? "hidden"
    : isReportView
      ? "collapsed"
      : null;
  const [mode, setMode] = React.useState<SidebarMode>("expanded");
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    setDrawerOpen(false);
    setMode(routeMode ?? "expanded");
  }, [routeMode]);

  React.useEffect(() => {
    const openSidebar = () => setDrawerOpen(true);
    window.addEventListener("cardioline:open-sidebar", openSidebar);
    return () =>
      window.removeEventListener("cardioline:open-sidebar", openSidebar);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      <Sidebar
        mode={routeMode ?? mode}
        onModeChange={setMode}
        drawerOpen={drawerOpen}
        onCloseDrawer={() => setDrawerOpen(false)}
      />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {(routeMode ?? mode) === "hidden" && !isExamView && (
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open sidebar"
            className="absolute left-3 top-3 z-30 rounded-md border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:bg-orange-50 hover:text-[#ee5b00]"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {!isExamView && <Header sidebarHidden={mode === "hidden"} />}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
