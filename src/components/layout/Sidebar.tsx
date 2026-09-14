'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { LayoutDashboard, Inbox, PhoneCall, FolderKanban, Settings, Users, FileText, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { activeUser } = useAppStore();

  if (!activeUser) return null;

  const getNavItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    ];

    if (activeUser.role === 'Investigator') {
      return [
        ...baseItems,
        { name: 'Intake Queue', href: '/intake', icon: Inbox },
        { name: 'Unlinked Calls', href: '/calls', icon: PhoneCall },
        { name: 'All Cases', href: '/cases', icon: FolderKanban },
        { name: 'Reports', href: '/reports', icon: FileText },
      ];
    }

    if (activeUser.role === 'SysAdmin') {
      return [
        ...baseItems,
        { name: 'Organization Settings', href: '/settings', icon: Settings },
        { name: 'User Management', href: '/users', icon: Users },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className={cn("flex h-screen w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground", className)}>
      <div className="flex h-14 items-center border-b border-border px-4">
        <ShieldAlert className="mr-2 h-6 w-6 text-primary" />
        <span className="text-lg font-bold tracking-tight text-primary">TARI Ethics</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">
            {activeUser.avatar}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{activeUser.name}</p>
            <p className="text-xs text-muted-foreground">{activeUser.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
