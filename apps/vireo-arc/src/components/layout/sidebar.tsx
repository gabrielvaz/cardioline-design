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
  BarChart3,
  Radio,
  Moon,
  MoreHorizontal,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
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
import { currentUser } from "@/lib/mock-data";
import { usePrototypeData } from "@/lib/prototype-data";
import { useSession } from "@/lib/session";
import { moduleLabel, navigationFor, type ModuleId } from "@/lib/roles";
import { asset } from "@/lib/asset";

export type { SidebarMode };

/* Navigation is derived from the signed-in role, never hardcoded: a module the
   role cannot open is absent, not present-and-disabled. Settings is appended
   for everyone — every profile has preferences of its own to manage. */
const moduleIcons: Record<ModuleId, SidebarItem["icon"]> = {
  dashboard: LayoutDashboard,
  capture: Radio,
  examInbox: Inbox,
  operations: BarChart3,
  exams: Activity,
  patients: Users,
  reports: FileText,
  administration: ShieldCheck,
  systemConfig: SlidersHorizontal,
};

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
  const { data } = usePrototypeData();
  const { role } = useSession();
  const canHide = /^\/(exams|reports)\/[^/]+/.test(pathname);
  const expanded =
    mode === "expanded" || (mode === "hidden" && drawerOpen);

  /* Same number the Exam Inbox header reports as "Awaiting report": every exam
     sitting in the worklist, assigned or not. */
  const pendingExams = data.inbox.length;

  const items: SidebarItem[] = [
    ...navigationFor(role).map((module) => ({
      label: moduleLabel(role, module.id),
      href: module.href,
      icon: moduleIcons[module.id],
      active: pathname === module.href || pathname.startsWith(`${module.href}/`),
      ...(module.id === "examInbox" && {
        badge: pendingExams,
        badgeLabel: "exams awaiting your report",
      }),
    })),
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings" || pathname.startsWith("/settings/"),
    },
  ];

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
        /* Official wordmark, 390x67 intrinsic. Two approved color combinations:
           the grey lockup on light grounds, the white one on the navy sidebar
           in dark mode — see public/brand/README.md. */
        <>
          <Image
            src={asset("/brand/vireo-ark.svg")}
            alt="Vireo ARK"
            width={390}
            height={67}
            priority
            className="h-5 w-auto dark:hidden"
          />
          <Image
            src={asset("/brand/vireo-ark-white.svg")}
            alt="Vireo ARK"
            width={390}
            height={67}
            priority
            className="hidden h-5 w-auto dark:block"
          />
        </>
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
          {/* Intrinsic size of the source asset (600x38).  Declaring a
              different ratio here makes next/image letterbox the artwork and
              serve a downscaled file, which is what made the mark look
              blurred. `sizes` keeps a 2x-ready candidate in the srcset. */}
          <Image
            src="https://cardioline.com/wp-content/uploads/2022/08/logo.png"
            alt="Cardioline"
            width={600}
            height={38}
            sizes="128px"
            className="h-2 w-auto"
          />
        </div>
      )}
      <UserMenu expanded={expanded} />
    </>
  );
}

function UserMenu({ expanded }: { expanded: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const { role } = useSession();
  const avatar = (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
      {currentUser.initials}
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
                  {currentUser.name}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {role.name}
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
          <DropdownMenuLabel className="normal-case tracking-normal">
            <span className="block text-sm font-semibold text-foreground">
              {currentUser.name}
            </span>
            <span className="mt-0.5 block text-xs font-medium text-muted-foreground">
              {role.name}
            </span>
          </DropdownMenuLabel>
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
