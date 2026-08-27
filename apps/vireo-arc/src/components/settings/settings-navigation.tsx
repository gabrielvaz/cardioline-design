'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Building2, FileText, Lock, MonitorCog, ShieldCheck, User, Users } from 'lucide-react';
import { cn } from '@cardioline/ui';
import { useSession } from '@/lib/session';
import type { ModuleId } from '@/lib/roles';

/* `requires` gates a group on the same module access the sidebar uses, so a
   profile that cannot reach Administration does not see its links here either.
   Account has no gate: every profile owns its own preferences. */
const groups: {
  label: string;
  requires?: ModuleId;
  items: [string, string, typeof User][];
}[] = [
  {
    label: 'Account',
    items: [['Profile', '/settings', User], ['Notifications', '/settings/notifications', Bell], ['Security', '/settings/security', Lock]],
  },
  {
    label: 'Configuration',
    requires: 'systemConfig',
    items: [['System', '/settings/system', MonitorCog], ['Reports', '/settings/reports', FileText]],
  },
  {
    label: 'Administration',
    requires: 'administration',
    items: [['Users', '/settings/admin/users', Users], ['Sites', '/settings/admin/sites', Building2], ['Groups', '/settings/admin/groups', Users], ['Roles', '/settings/admin/roles', ShieldCheck], ['Devices', '/settings/admin/devices', MonitorCog]],
  },
];

export function SettingsNavigation() {
  const pathname = usePathname();
  const { role } = useSession();
  const visible = groups.filter((g) => !g.requires || role.access[g.requires] !== 'none');
  return <aside className="w-full shrink-0 border-b border-gray-200 bg-slate-50/60 p-4 md:w-60 md:border-b-0 md:border-r"><div className="space-y-5">{visible.map((group) => <section key={group.label}><p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">{group.label}</p><div className="space-y-1">{group.items.map(([name, href, Icon]) => { const active = pathname === href; return <Link key={href} href={href} className={cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors', active ? 'bg-orange-50 text-[#ee5b00]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}><Icon className={cn('h-4 w-4', active ? 'text-[#ee5b00]' : 'text-gray-400')} />{name}</Link>; })}</div></section>)}</div></aside>;
}
