'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Activity, EyeOff, FileText, LayoutDashboard, LogOut, PanelLeftClose, Settings, Users } from 'lucide-react';
import { cn } from '@cardioline/ui';

export type SidebarMode = 'expanded' | 'collapsed' | 'hidden';
const navigation = [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }, { name: 'Patients', href: '/patients', icon: Users }, { name: 'Exams & ECG', href: '/exams', icon: Activity }, { name: 'Reports', href: '/reports', icon: FileText }, { name: 'Settings', href: '/settings', icon: Settings }];

export function Sidebar({ mode, onModeChange, drawerOpen, onCloseDrawer }: { mode: SidebarMode; onModeChange: (mode: SidebarMode) => void; drawerOpen: boolean; onCloseDrawer: () => void }) {
  if (mode === 'hidden') return <>{drawerOpen && <><button aria-label="Close sidebar overlay" onClick={onCloseDrawer} className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px]" /><aside className="fixed inset-y-0 left-0 z-50 w-64 animate-in slide-in-from-left duration-200"><SidebarPanel expanded onCollapse={() => { onCloseDrawer(); onModeChange('collapsed'); }} onHide={onCloseDrawer} /></aside></>}</>;
  return <aside className={cn('h-full shrink-0 border-r border-gray-200 bg-white transition-[width] duration-200', mode === 'expanded' ? 'w-64' : 'w-[72px]')}><SidebarPanel expanded={mode === 'expanded'} onCollapse={() => onModeChange('collapsed')} onExpand={() => onModeChange('expanded')} onHide={() => onModeChange('hidden')} /></aside>;
}

function SidebarPanel({ expanded, onCollapse, onExpand, onHide }: { expanded: boolean; onCollapse: () => void; onExpand?: () => void; onHide: () => void }) {
  const pathname = usePathname(); const canHide = /^\/(exams|reports)\/[^/]+/.test(pathname);
  return <div className="flex h-full flex-col bg-white"><div className={cn('flex h-16 items-center border-b border-gray-200', expanded ? 'justify-between px-5' : 'justify-center')}>{expanded ? <><Image src="https://cardioline.com/wp-content/uploads/2022/08/logo.png" alt="Cardioline Logo" width={42} height={8} sizes="42px" className="h-2 w-auto object-contain" /><button onClick={onCollapse} title="Collapse sidebar" aria-label="Collapse sidebar" className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-[#071046]"><PanelLeftClose className="h-5 w-5" /></button></> : <div className="flex flex-col items-center gap-1"><button onClick={onExpand} title="Expand sidebar" aria-label="Expand sidebar" className="font-heading text-xl font-extrabold tracking-[0.2em] text-[#ee5b00]">C</button>{canHide && <button onClick={onHide} title="Hide sidebar" aria-label="Hide sidebar" className="rounded p-1 text-gray-600 hover:bg-gray-100"><EyeOff className="h-4 w-4" /></button>}</div>}</div><nav className={cn('flex-1 space-y-1 py-5', expanded ? 'px-4' : 'px-2')} aria-label="Main navigation">{navigation.map((item) => { const active = pathname === item.href || pathname.startsWith(`${item.href}/`); return <Link key={item.name} href={item.href} title={expanded ? undefined : item.name} className={cn('group flex items-center rounded-md text-sm font-medium transition-colors', expanded ? 'px-3 py-2.5' : 'justify-center p-3', active ? 'bg-orange-50 text-[#ee5b00]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}><item.icon className={cn('h-5 w-5 shrink-0', expanded && 'mr-3', active ? 'text-[#ee5b00]' : 'text-gray-600')} />{expanded && item.name}</Link>; })}</nav><div className={cn('border-t border-gray-200', expanded ? 'p-4' : 'p-2')}><Link href="/login" title={expanded ? undefined : 'Log out'} className={cn('group flex items-center rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900', expanded ? 'px-3 py-2' : 'justify-center p-3')}><LogOut className={cn('h-5 w-5 text-gray-600', expanded && 'mr-3')} />{expanded && 'Log out'}</Link></div></div>;
}
