"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Moon,
  MoreHorizontal,
  Settings,
  Sun,
  UserRound,
  Users,
} from "lucide-react";
import {
  AppSidebar,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  type SidebarItem,
  type SidebarMode,
} from "@cardioline/ui";
import { useTheme } from "@/components/theme/theme-provider";

export type { SidebarMode };

const navigation: Array<{ name: string; href: string; icon: SidebarItem["icon"] }> = [
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
  const pathname = usePathname();
  const canHide = /^\/(exams|reports)\/[^/]+/.test(pathname);
  const expanded =
    mode === "expanded" || (mode === "hidden" && drawerOpen);

  const items: SidebarItem[] = navigation.map((item) => ({
    label: item.name,
    href: item.href,
    icon: item.icon,
    active: pathname === item.href || pathname.startsWith(`${item.href}/`),
  }));

  return (
    <AppSidebar
      mode={mode}
      onModeChange={onModeChange}
      items={items}
      canHide={canHide}
      drawerOpen={drawerOpen}
      onDrawerOpenChange={(open) => {
        if (!open) onCloseDrawer();
      }}
      logo={
        <span className="font-heading text-base font-bold tracking-[0.12em] text-accent">
          Vireo <span className="text-primary">ARC</span>
        </span>
      }
      collapsedLogo={
        <span className="font-heading text-xl font-extrabold text-accent">
          V
        </span>
      }
      footer={<SidebarFooter expanded={expanded} />}
      renderLink={(item, content) => <Link href={item.href}>{content}</Link>}
    />
  );
}

function SidebarFooter({ expanded }: { expanded: boolean }) {
  return (
    <>
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
    </>
  );
}

function UserMenu({ expanded }: { expanded: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const avatar = (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
      SJ
    </div>
  );
  return (
    <div className={cn("border-t border-border", expanded ? "p-4" : "p-2")}>
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
                className="rounded-full outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {avatar}
              </button>
            </DropdownMenuTrigger>
          )}
          {expanded && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  Dr. Sarah Jenkins
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  Cardiologist
                </p>
              </div>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="More user actions"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
