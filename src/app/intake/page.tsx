'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export default function IntakeQueuePage() {
  const { cases, activeUser } = useAppStore();

  const intakeCases = cases.filter(c => c.status === 'New — Needs Triage');

  if (activeUser?.role !== 'Compliance Admin') {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        You do not have permission to view the intake queue.
      </div>
    );
  }

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'Critical': return <Badge variant="destructive">Critical</Badge>;
      case 'High': return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>;
      case 'Medium': return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
      case 'Low': return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">Unrated</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Intake Queue</h1>
        <p className="text-muted-foreground">Review and triage new whistleblower reports.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Needs Triage ({intakeCases.length})</CardTitle>
          <CardDescription>Cases that have been submitted but not yet categorized or assigned.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Number</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intakeCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No new cases need triage.
                  </TableCell>
                </TableRow>
              ) : (
                intakeCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      <Link href={`/cases/${c.id}`} className="text-blue-600 hover:underline">
                        {c.caseNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{c.source}</TableCell>
                    <TableCell>{getSeverityBadge(c.severity)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString()}
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
