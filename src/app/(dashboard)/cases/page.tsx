'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Building2, ArrowLeft, FolderOpen } from 'lucide-react';
import Link from 'next/link';

export default function CasesPage() {
  const { cases, activeUser, organizations } = useAppStore();
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  if (!activeUser) return null;

  const isInvestigator = activeUser.role === 'Investigator';
  const filteredCases = isInvestigator 
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
      case 'Received':
      case 'Re-opened': return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>;
      case 'Acknowledged':
      case 'Information Sought':
      case 'Under Analysis': return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>;
      case 'PAR Prepared':
      case 'Closed': return <Badge className="bg-green-600 hover:bg-green-700">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  // Organizations View
  if (!selectedOrgId) {
    const orgsWithCaseCounts = organizations.map(org => ({
      ...org,
      caseCount: filteredCases.filter(c => c.organizationId === org.id).length
    }));

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            {isInvestigator ? 'My Cases' : 'All Cases'}
          </h1>
          <p className="text-muted-foreground">
            {isInvestigator ? 'Select an organization to view your assigned investigations.' : 'Select an organization to view its reported incidents.'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orgsWithCaseCounts.map((org) => (
            <Card 
              key={org.id} 
              className="cursor-pointer hover:shadow-md transition-shadow group border-slate-200 dark:border-slate-800"
              onClick={() => setSelectedOrgId(org.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">{org.name}</CardTitle>
                <Building2 className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mt-4">
                  <FolderOpen className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {org.caseCount} {org.caseCount === 1 ? 'Case' : 'Cases'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Specific Organization View
  const selectedOrg = organizations.find(o => o.id === selectedOrgId);
  const displayCases = filteredCases
    .filter(c => c.organizationId === selectedOrgId)
    .map(c => ({
      ...c,
      organizationName: selectedOrg?.name || 'Unknown'
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedOrgId(null)}
              className="-ml-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              {selectedOrg?.name} Cases
            </h1>
          </div>
          <p className="text-muted-foreground ml-12">
            {isInvestigator ? 'Investigations assigned to you for this organization.' : `All reported incidents for ${selectedOrg?.name}.`}
          </p>
        </div>
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
                <TableHead>Organization</TableHead>
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
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No cases found for this organization.
                  </TableCell>
                </TableRow>
              ) : (
                displayCases.map((c) => (
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
