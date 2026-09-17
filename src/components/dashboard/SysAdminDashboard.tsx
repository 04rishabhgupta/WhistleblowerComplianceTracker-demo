'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, FolderKanban, Activity } from 'lucide-react';

export function SysAdminDashboard() {
  const { users, organizations, cases, auditLogs } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Platform Dashboard</h1>
        <p className="text-muted-foreground">High-level overview of the TARI Ethics system health.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
              <CardDescription>Active managed tenants</CardDescription>
            </div>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Platform Users</CardTitle>
              <CardDescription>Staff accounts across roles</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Cases Processed</CardTitle>
              <CardDescription>Across all organizations</CardDescription>
            </div>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Audit Log
          </CardTitle>
          <CardDescription>Recent automated and user-driven actions across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.slice(0, 8).map((log) => {
              const actor = users.find(u => u.id === log.actorId)?.name || log.actorId;
              return (
                <div key={log.id} className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {actor} <span className="text-muted-foreground font-normal">{log.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Case Reference: {log.caseId}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
