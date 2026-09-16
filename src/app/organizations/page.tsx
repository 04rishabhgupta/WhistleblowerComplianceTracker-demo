'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, Plus, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OrganizationsPage() {
  const { organizations, activeUser, addOrganization } = useAppStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgEmail, setNewOrgEmail] = useState('');

  if (!activeUser) return null;
  if (activeUser.role !== 'Investigator') {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        You do not have permission to view organizations.
      </div>
    );
  }

  const handleAddOrg = () => {
    if (!newOrgName.trim() || !newOrgEmail.trim()) return;

    addOrganization({
      name: newOrgName,
      intakeEmail: newOrgEmail,
    });

    toast('Organization Added', {
      description: `${newOrgName} has been created successfully.`,
    });

    setNewOrgName('');
    setNewOrgEmail('');
    setIsAddOpen(false);
  };

  const copyIntakeLink = (orgId: string, orgName: string) => {
    const url = `${window.location.origin}/submit-report/${orgId}`;
    navigator.clipboard.writeText(url);
    toast('Link Copied', {
      description: `Intake link for ${orgName} copied to clipboard.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Client Organisations</h1>
          <p className="text-muted-foreground">Manage client organisations and generate intake links.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" />
            Add Organisation
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Organisation</DialogTitle>
              <DialogDescription>
                Create a new client organisation for whistleblowing intake.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Organisation Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Acme Corp"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Intake Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. intake@acmecorp.com"
                  value={newOrgEmail}
                  onChange={(e) => setNewOrgEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddOrg} disabled={!newOrgName || !newOrgEmail}>Save Organisation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            All Organisations
          </CardTitle>
          <CardDescription>A list of all client organisations using the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organisation Name</TableHead>
                <TableHead>Intake Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No organisations found.
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>{org.intakeEmail}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyIntakeLink(org.id, org.name)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Intake Link
                      </Button>
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
