'use client';

import { useAppStore } from '@/lib/store';
import { SysAdminDashboard } from '@/components/dashboard/SysAdminDashboard';
import { InvestigatorDashboard } from '@/components/dashboard/InvestigatorDashboard';

export default function Home() {
  const { activeUser } = useAppStore();

  if (!activeUser) return null;

  switch (activeUser.role) {
    case 'Investigator':
      return <InvestigatorDashboard />;
    case 'SysAdmin':
      return <SysAdminDashboard />;
    default:
      return <div>Unknown Role</div>;
  }
}
