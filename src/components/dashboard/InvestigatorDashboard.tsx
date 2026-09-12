'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export function InvestigatorDashboard() {
  const { cases, calls, activeUser, organizations } = useAppStore();

  if (!activeUser) return null;

  const intakeCases = cases.filter(c => c.status === 'New — Needs Triage');
  const recentCases = cases.slice(0, 5).map(c => {
    return {
      ...c,
      organizationName: organizations.find(org => org.id === c.organizationId)?.name || 'Unknown'
    }
  });
  const openCases = cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');
  const needsTriage = cases.filter(c => c.status === 'New — Needs Triage');
  const highSeverity = cases.filter(c => c.severity === 'High' || c.severity === 'Critical');
  const unlinkedCalls = calls.filter(c => !c.caseId);

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
        <h1 className="text-3xl font-bold tracking-tight text-primary">Compliance Overview</h1>
        <p className="text-muted-foreground">Monitor and triage active whistleblower cases.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
            <FolderKanbanIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openCases.length}</div>
            <p className="text-xs text-muted-foreground">Active investigations</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Needs Triage</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{needsTriage.length}</div>
            <p className="text-xs text-blue-700 dark:text-blue-400">Cases awaiting review</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-300">High / Critical</CardTitle>
            <ShieldAlert className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{highSeverity.length}</div>
            <p className="text-xs text-orange-700 dark:text-orange-400">Require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2 days</div>
            <p className="text-xs text-muted-foreground">Trailing 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
            <CardDescription>Latest reports requiring attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.organizationName}</TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/cases/${c.id}`} className="text-blue-600 hover:underline">
                        {c.caseNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{getStatusBadge(c.status)}</TableCell>
                    <TableCell>{getSeverityBadge(c.severity)}</TableCell>
                    <TableCell>{c.category || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Unlinked Hotline Calls</CardTitle>
            <CardDescription>Recent recordings not attached to cases.</CardDescription>
          </CardHeader>
          <CardContent>
            {unlinkedCalls.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <p>All calls have been processed.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {unlinkedCalls.slice(0, 4).map((call) => (
                  <div key={call.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Hotline Received</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(call.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{call.durationSeconds}s</Badge>
                      <Link href="/calls" className="text-xs text-blue-600 hover:underline">Review</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FolderKanbanIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="M8 10v4" />
      <path d="M12 10v2" />
      <path d="M16 10v6" />
    </svg>
  )
}
