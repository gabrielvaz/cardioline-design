"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Activity,
  EyeOff,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  Settings,
  Sun,
  UserRound,
  Users,
} from "lucide-react";
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@cardioline/ui";
import { useTheme } from "@/components/theme/theme-provider";

export type SidebarMode = "expanded" | "collapsed" | "hidden";
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Exam Inbox", href: "/exam-inbox", icon: Inbox },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Exams and ECG", href: "/exams", icon: Activity },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({
  mode,
  onModeChange,
  drawerOpen,
  onCloseDrawer,
}: {
  mode: SidebarMode;
  onModeChange: (mode: SidebarMode) => void;
  drawerOpen: boolean;
  onCloseDrawer: () => void;
}) {
  if (mode === "hidden")
    return (
      <>
        {drawerOpen && (
          <>
            <button
              aria-label="Close sidebar overlay"
              onClick={onCloseDrawer}
              className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px]"
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-64 animate-in slide-in-from-left duration-200">
              <SidebarPanel
                expanded
                onCollapse={() => {
                  onCloseDrawer();
                  onModeChange("collapsed");
                }}
                onHide={onCloseDrawer}
              />
            </aside>
          </>
        )}
      </>
    );
  return (
    <aside
      className={cn(
        "h-full shrink-0 border-r border-gray-200 bg-white transition-[width] duration-200",
        mode === "expanded" ? "w-64" : "w-[72px]",
      )}
    >
      <SidebarPanel
        expanded={mode === "expanded"}
        onCollapse={() => onModeChange("collapsed")}
        onExpand={() => onModeChange("expanded")}
        onHide={() => onModeChange("hidden")}
      />
    </aside>
  );
}

function SidebarPanel({
  expanded,
  onCollapse,
  onExpand,
  onHide,
}: {
  expanded: boolean;
  onCollapse: () => void;
  onExpand?: () => void;
  onHide: () => void;
}) {
  const pathname = usePathname();
  const canHide = /^\/(exams|reports)\/[^/]+/.test(pathname);
  return (
    <div className="flex h-full flex-col bg-white">
      <div
        className={cn(
          "flex h-16 items-center border-b border-gray-200",
          expanded ? "justify-between px-5" : "justify-center",
        )}
      >
        {expanded ? (
          <>
            <span className="font-heading text-base font-bold tracking-[0.12em] text-[#071046]">
              Vireo <span className="text-[#ee5b00]">ARC</span>
            </span>
            <button
              onClick={onCollapse}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-[#071046]"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onExpand}
              title="Expand sidebar"
              aria-label="Expand sidebar"
              className="font-heading text-xl font-extrabold text-[#071046]"
            >
              V
            </button>
            {canHide && (
              <button
                onClick={onHide}
                title="Hide sidebar"
                aria-label="Hide sidebar"
                className="rounded p-1 text-gray-600 hover:bg-gray-100"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      <nav
        className={cn("flex-1 space-y-1 py-5", expanded ? "px-4" : "px-2")}
        aria-label="Main navigation"
      >
        {navigation.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              title={expanded ? undefined : item.name}
              className={cn(
                "group flex items-center rounded-md text-sm font-medium transition-colors",
                expanded ? "px-3 py-2.5" : "justify-center p-3",
                active
                  ? "bg-orange-50 text-[#ee5b00]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  expanded && "mr-3",
                  active ? "text-[#ee5b00]" : "text-gray-600",
                )}
              />
              {expanded && item.name}
            </Link>
          );
        })}
      </nav>
      {expanded && (
        <div className="px-4 pb-6">
          <Image
            src="https://cardioline.com/wp-content/uploads/2022/08/logo.png"
            alt="Cardioline"
            width={42}
            height={8}
            sizes="42px"
            className="h-2 w-auto object-contain"
          />
        </div>
      )}
      <UserMenu expanded={expanded} />
    </div>
  );
}

function UserMenu({ expanded }: { expanded: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const avatar = (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#071046] text-sm font-semibold text-white">
      SJ
    </div>
  );
  return (
    <div className={cn("border-t border-gray-200", expanded ? "p-4" : "p-2")}>
      <DropdownMenu>
        <div
          className={cn(
            "flex items-center",
            expanded ? "gap-2" : "justify-center",
          )}
        >
          {expanded ? (
            avatar
          ) : (
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Open user menu"
                className="rounded-full outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#ee5b00] focus-visible:ring-offset-2"
              >
                {avatar}
              </button>
            </DropdownMenuTrigger>
          )}
          {expanded && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  Dr. Sarah Jenkins
                </p>
                <p className="mt-1 truncate text-xs text-gray-500">
                  Cardiologist
                </p>
              </div>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="More user actions"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#071046]"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
            </>
          )}
        </div>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Dr. Sarah Jenkins</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <UserRound />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={toggleTheme}>
            {theme === "dark" ? <Sun /> : <Moon />}
            {theme === "dark" ? "Use light mode" : "Use dark mode"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild destructive>
            <Link href="/login">
              <LogOut />
              Log out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
