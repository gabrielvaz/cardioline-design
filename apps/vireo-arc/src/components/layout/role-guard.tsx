"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { moduleById, modules } from "@/lib/roles";

/**
 * Keeps the application consistent with the signed-in role.
 *
 * Two jobs: send a user who has not finished the first-login setup back to it,
 * and turn away a deep link into a module the role cannot open. Hiding a
 * module from the navigation is presentation; this is the part that means it.
 *
 * Not a security boundary — authentication is still mocked. It exists so the
 * prototype behaves coherently, which is the point of the role work.
 */
export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { hydrated, state, role, home } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  /* Settings is reachable by everyone: it is where preferences live, and the
     administration pages inside it are gated by the `administration` module. */
  const blocked = React.useMemo(() => {
    if (pathname.startsWith("/settings/admin") || pathname.startsWith("/settings/system")) {
      const module = pathname.startsWith("/settings/admin") ? "administration" : "systemConfig";
      return role.access[module] === "none";
    }
    if (pathname.startsWith("/settings")) return false;
    const match = modules
      .filter((m) => !m.href.startsWith("/settings"))
      .find((m) => pathname === m.href || pathname.startsWith(`${m.href}/`));
    return match ? role.access[match.id] === "none" : false;
  }, [pathname, role]);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!state.setupComplete) router.replace("/setup");
    else if (blocked) router.replace(moduleById(home).href);
  }, [blocked, home, hydrated, router, state.setupComplete]);

  /* Render nothing rather than a flash of a workspace the user is about to be
     moved out of. */
  if (!hydrated || !state.setupComplete || blocked) return null;
  return <>{children}</>;
}
