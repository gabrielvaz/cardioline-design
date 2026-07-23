'use client';

import * as React from 'react';
import { EyeOff, PanelLeftClose, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export type SidebarItem = { label: string; href: string; icon: LucideIcon; active?: boolean };
export type SidebarMode = 'expanded' | 'collapsed' | 'hidden';

type AppSidebarProps = {
  mode: SidebarMode;
  onModeChange: (mode: SidebarMode) => void;
  items: SidebarItem[];
  /** Expanded-state header content (brand mark, title, etc). */
  logo: React.ReactNode;
  /** Collapsed-state header content, wrapped in the expand trigger button. */
  collapsedLogo?: React.ReactNode;
  /** Rendered at the bottom of the panel, below the nav list. */
  footer?: React.ReactNode;
  drawerOpen?: boolean;
  onDrawerOpenChange?: (open: boolean) => void;
  /** Whether the collapsed-state "hide to drawer" control shows. */
  canHide?: boolean;
  /** Default renders a plain `<a href>`; override to use a router link (e.g. next/link). */
  renderLink?: (item: SidebarItem, content: React.ReactNode) => React.ReactNode;
};

const defaultRenderLink: NonNullable<AppSidebarProps['renderLink']> = (item, content) => (
  <a href={item.href}>{content}</a>
);

/**
 * Three-mode collapsible sidebar shell: `expanded` (w-64), `collapsed`
 * (w-[72px], icon-only), and `hidden` (rendered as a drawer over a scrim
 * when `drawerOpen`). Beat owns the mode/drawer interaction and chrome;
 * the caller supplies nav items, brand slots, footer content and, via
 * `renderLink`, its own routing primitive.
 */
export function AppSidebar({
  mode,
  onModeChange,
  items,
  logo,
  collapsedLogo,
  footer,
  drawerOpen = false,
  onDrawerOpenChange,
  canHide = false,
  renderLink = defaultRenderLink,
}: AppSidebarProps) {
  const closeDrawer = () => onDrawerOpenChange?.(false);

  if (mode === 'hidden') {
    if (!drawerOpen) return null;
    return (
      <>
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeDrawer}
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px]"
        />
        <aside className="fixed inset-y-0 left-0 z-50 w-64 animate-in slide-in-from-left duration-300 ease-out">
          <SidebarPanel
            expanded
            items={items}
            logo={logo}
            collapsedLogo={collapsedLogo}
            footer={footer}
            canHide={canHide}
            renderLink={renderLink}
            onCollapse={() => {
              closeDrawer();
              onModeChange('collapsed');
            }}
            onHide={closeDrawer}
          />
        </aside>
      </>
    );
  }

  return (
    <aside
      className={cn(
        'h-full shrink-0 overflow-hidden border-r border-border bg-card transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        mode === 'expanded' ? 'w-64' : 'w-[72px]',
      )}
    >
      <SidebarPanel
        expanded={mode === 'expanded'}
        items={items}
        logo={logo}
        collapsedLogo={collapsedLogo}
        footer={footer}
        canHide={canHide}
        renderLink={renderLink}
        onCollapse={() => onModeChange('collapsed')}
        onExpand={() => onModeChange('expanded')}
        onHide={() => onModeChange('hidden')}
      />
    </aside>
  );
}

function SidebarPanel({
  expanded,
  items,
  logo,
  collapsedLogo,
  footer,
  canHide,
  renderLink,
  onCollapse,
  onExpand,
  onHide,
}: {
  expanded: boolean;
  items: SidebarItem[];
  logo: React.ReactNode;
  collapsedLogo?: React.ReactNode;
  footer?: React.ReactNode;
  canHide?: boolean;
  renderLink: NonNullable<AppSidebarProps['renderLink']>;
  onCollapse: () => void;
  onExpand?: () => void;
  onHide: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-card">
      <div className="relative flex h-16 shrink-0 items-center overflow-hidden border-b border-border">
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-between px-5 transition-all duration-200 ease-out',
            expanded ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 pointer-events-none',
          )}
          aria-hidden={!expanded}
        >
          <span className="min-w-0 whitespace-nowrap">{logo}</span>
          <button
            type="button"
            onClick={onCollapse}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
            className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center gap-1 transition-all duration-200 ease-out',
            expanded ? 'translate-x-2 opacity-0 pointer-events-none' : 'translate-x-0 opacity-100',
          )}
          aria-hidden={expanded}
        >
          <button
            type="button"
            onClick={onExpand}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            tabIndex={expanded ? -1 : 0}
            className="flex items-center justify-center rounded-md transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {collapsedLogo}
          </button>
          {canHide && (
            <button
              type="button"
              onClick={onHide}
              title="Hide sidebar"
              aria-label="Hide sidebar"
              tabIndex={expanded ? -1 : 0}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted"
            >
              <EyeOff className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <nav
        className={cn('flex flex-col flex-1 gap-1 py-5', expanded ? 'px-4' : 'px-2')}
        aria-label="Main navigation"
      >
        {items.map((item) => {
          const content = (
            <span
              title={expanded ? undefined : item.label}
              className={cn(
                'group flex w-full items-center rounded-md text-sm font-medium transition-colors',
                expanded ? 'px-3 py-2.5' : 'justify-center p-3',
                item.active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  expanded && 'mr-3',
                  item.active ? 'text-primary' : 'text-muted-foreground',
                )}
              />
              {expanded && item.label}
            </span>
          );
          return <React.Fragment key={item.href}>{renderLink(item, content)}</React.Fragment>;
        })}
      </nav>
      {footer}
    </div>
  );
}
