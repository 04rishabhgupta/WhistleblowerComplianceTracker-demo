'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export default function CasesPage() {
  const { cases, activeUser } = useAppStore();

  if (!activeUser) return null;

  const isInvestigator = activeUser.role === 'Investigator';
  const displayCases = isInvestigator 
    ? cases.filter(c => c.assigneeIds.includes(activeUser.id)) 
    : cases;

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
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {isInvestigator ? 'My Cases' : 'All Cases'}
        </h1>
        <p className="text-muted-foreground">
          {isInvestigator ? 'Investigations assigned to you.' : 'Complete repository of all reported incidents.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Directory</CardTitle>
          <CardDescription>Filter and search through the case load.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No cases found.
                  </TableCell>
                </TableRow>
              ) : (
                displayCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      <Link href={`/cases/${c.id}`} className="text-blue-600 hover:underline">
                        {c.caseNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{getStatusBadge(c.status)}</TableCell>
                    <TableCell>{getSeverityBadge(c.severity)}</TableCell>
                    <TableCell>{c.category || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                    <TableCell>{c.department || '—'}</TableCell>
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
