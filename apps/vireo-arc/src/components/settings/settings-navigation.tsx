'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Building2, FileText, Lock, MonitorCog, ShieldCheck, User, Users } from 'lucide-react';
import { cn } from '@cardioline/ui';

const groups = [
  { label: 'Account', items: [['Profile', '/settings', User], ['Notifications', '/settings/notifications', Bell], ['Security', '/settings/security', Lock]] },
  { label: 'Configuration', items: [['System', '/settings/system', MonitorCog], ['Reports', '/settings/reports', FileText]] },
  { label: 'Administration', items: [['Users', '/settings/admin/users', Users], ['Sites', '/settings/admin/sites', Building2], ['Groups', '/settings/admin/groups', Users], ['Roles', '/settings/admin/roles', ShieldCheck], ['Devices', '/settings/admin/devices', MonitorCog]] },
] as const;

export function SettingsNavigation() {
  const pathname = usePathname();
  return <aside className="w-full shrink-0 border-b border-gray-200 bg-slate-50/60 p-4 md:w-60 md:border-b-0 md:border-r"><p className="mb-4 px-2 text-sm font-semibold text-[#071046]">Settings menu</p><div className="space-y-5">{groups.map((group) => <section key={group.label}><p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">{group.label}</p><div className="space-y-1">{group.items.map(([name, href, Icon]) => { const active = pathname === href; return <Link key={href} href={href} className={cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors', active ? 'bg-orange-50 text-[#ee5b00]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}><Icon className={cn('h-4 w-4', active ? 'text-[#ee5b00]' : 'text-gray-400')} />{name}</Link>; })}</div></section>)}</div></aside>;
}
