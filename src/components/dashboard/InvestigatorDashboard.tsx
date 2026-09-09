'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export function InvestigatorDashboard() {
  const { cases, activeUser } = useAppStore();

  if (!activeUser) return null;

  const myCases = cases.filter(c => c.assigneeIds.includes(activeUser.id));
  const activeCases = myCases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');
  const criticalCases = myCases.filter(c => c.severity === 'Critical');

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'Critical': return <Badge variant="destructive">Critical</Badge>;
      case 'High': return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>;
      case 'Medium': return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
      case 'Low': return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">Unrated</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New — Needs Triage': return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>;
      case 'In Progress':
      case 'Under Investigation': return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>;
      case 'Resolved':
      case 'Closed': return <Badge className="bg-green-600 hover:bg-green-700">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">My Investigations</h1>
        <p className="text-muted-foreground">Manage your assigned cases and review evidence.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCases.length}</div>
            <p className="text-xs text-muted-foreground">Currently investigating</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">Critical Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{criticalCases.length}</div>
            <p className="text-xs text-red-700 dark:text-red-400">Assigned to you</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCases.length}</div>
            <p className="text-xs text-muted-foreground">Historical workload</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Cases</CardTitle>
          <CardDescription>View and manage the cases you are assigned to.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    You have no assigned cases.
                  </TableCell>
                </TableRow>
              ) : (
                myCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      <Link href={`/cases/${c.id}`} className="text-blue-600 hover:underline">
                        {c.caseNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{getStatusBadge(c.status)}</TableCell>
                    <TableCell>{getSeverityBadge(c.severity)}</TableCell>
                    <TableCell>{c.category || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
