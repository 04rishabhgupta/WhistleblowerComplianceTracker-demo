'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PhoneCall, Play, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function CallsPage() {
  const { calls, activeUser } = useAppStore();

  if (!activeUser) return null;

  const unlinkedCalls = calls.filter(c => !c.caseId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const linkedCalls = calls.filter(c => c.caseId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (activeUser.role !== 'Compliance Admin') {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        You do not have permission to view the call queue.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Hotline Call Queue</h1>
        <p className="text-muted-foreground">Manage incoming voice reports and link them to cases.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unlinked Calls ({unlinkedCalls.length})</CardTitle>
          <CardDescription>Review new hotline recordings and attach them to new or existing cases.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Audio</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unlinkedCalls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground h-24">No unlinked calls.</TableCell>
                </TableRow>
              ) : (
                unlinkedCalls.map(call => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium">{new Date(call.timestamp).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{call.status}</Badge></TableCell>
                    <TableCell>{call.durationSeconds}s</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Play className="h-4 w-4" /> Play
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <LinkCallDialog callId={call.id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently Linked Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Linked Case</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkedCalls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground h-24">No linked calls.</TableCell>
                </TableRow>
              ) : (
                linkedCalls.slice(0, 5).map(call => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium">{new Date(call.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      {call.caseId ? (
                         <Badge variant="secondary" className="bg-blue-100 text-blue-800">Linked</Badge>
                      ) : '—'}
                    </TableCell>
                    <TableCell>{call.durationSeconds}s</TableCell>
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

function LinkCallDialog({ callId }: { callId: string }) {
  const [open, setOpen] = useState(false);
  const { cases, linkCallToCase } = useAppStore();
  const [selectedCase, setSelectedCase] = useState('');

  const activeCases = cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');

  const handleLink = () => {
    if (!selectedCase) return;
    linkCallToCase(callId, selectedCase);
    setOpen(false);
    toast.success('Call linked to case successfully');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3">
        <LinkIcon className="h-4 w-4" /> Link to Case
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link Call to Case</DialogTitle>
          <DialogDescription>
            Attach this audio recording to an existing open investigation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={selectedCase} onValueChange={(val) => setSelectedCase(val || '')}>
            <SelectTrigger>
              <SelectValue placeholder="Search or select a case..." />
            </SelectTrigger>
            <SelectContent>
              {activeCases.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.caseNumber} - {c.category || 'Uncategorized'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleLink} disabled={!selectedCase}>Link Call</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
