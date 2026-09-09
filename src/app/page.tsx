'use client';

import { useAppStore } from '@/lib/store';
import { ComplianceAdminDashboard } from '@/components/dashboard/ComplianceAdminDashboard';
import { InvestigatorDashboard } from '@/components/dashboard/InvestigatorDashboard';
import { SuperAdminDashboard } from '@/components/dashboard/SuperAdminDashboard';

export default function Home() {
  const { activeUser } = useAppStore();

  if (!activeUser) return null;

  switch (activeUser.role) {
    case 'Compliance Admin':
      return <ComplianceAdminDashboard />;
    case 'Investigator':
      return <InvestigatorDashboard />;
    case 'Super Admin':
      return <SuperAdminDashboard />;
    default:
      return <div>Unknown Role</div>;
  }
}
