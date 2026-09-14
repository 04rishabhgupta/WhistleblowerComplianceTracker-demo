'use client';

import { useAppStore } from '@/lib/store';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { RoleSelector } from '../RoleSelector';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { activeUser } = useAppStore();

  if (!activeUser) {
    return <RoleSelector />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
