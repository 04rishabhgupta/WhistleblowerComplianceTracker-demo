'use client';

import { useAppStore } from '@/lib/store';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { activeUser } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!activeUser) {
      router.push('/');
    }
  }, [activeUser, router]);

  if (!mounted || !activeUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
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
