'use client';

import { useAppStore } from '@/lib/store';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Clock, MessageSquare, Paperclip, PhoneCall, ShieldCheck, Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const { cases, correspondences, internalNotes, auditLogs, calls, activeUser, addCorrespondence, addInternalNote } = useAppStore();
  const caseData = cases.find((c) => c.id === params.id);
  
  if (!caseData || !activeUser) return notFound();

  const caseCorrespondences = correspondences.filter(c => c.caseId === caseData.id).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const caseNotes = internalNotes.filter(n => n.caseId === caseData.id).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const caseAuditLogs = auditLogs.filter(l => l.caseId === caseData.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const caseCalls = calls.filter(c => c.caseId === caseData.id);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-primary">Case {caseData.caseNumber}</h1>
            <Badge className="bg-amber-500">{caseData.status}</Badge>
            {caseData.severity && (
              <Badge variant={caseData.severity === 'Critical' ? 'destructive' : 'secondary'}>
                {caseData.severity} Priority
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Reported via {caseData.source} on {new Date(caseData.createdAt).toLocaleDateString()}</p>
        </div>
        {activeUser.role === 'Compliance Admin' && caseData.status === 'New — Needs Triage' && (
          <TriageDialog caseId={caseData.id} />
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:w-[800px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="correspondence">Correspondence</TabsTrigger>
          <TabsTrigger value="notes">Internal Notes</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="calls">Call History</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Case Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{caseData.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground block">Category</span>
                  <span>{caseData.category || '—'}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block">Department</span>
                  <span>{caseData.department || '—'}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block">Incident Date</span>
                  <span>{caseData.incidentDate ? new Date(caseData.incidentDate).toLocaleDateString() : '—'}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block">Reporter</span>
                  <span>{caseData.reporterEmail || caseData.reporterPhone || 'Anonymous'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correspondence" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporter Correspondence</CardTitle>
              <CardDescription>Secure two-way communication thread with the reporter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {caseCorrespondences.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No correspondence history.</p>
                ) : (
                  caseCorrespondences.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.sender.isStaff ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="mt-1">
                        <AvatarFallback className={msg.sender.isStaff ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                          {msg.sender.isStaff ? 'TARI' : 'REP'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col max-w-[80%] ${msg.sender.isStaff ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-semibold">{msg.sender.name}</span>
                          <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                        <div className={`rounded-lg p-3 text-sm ${msg.sender.isStaff ? 'bg-primary text-primary-foreground' : 'bg-muted border'}`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {activeUser.role !== 'Investigator' && (
                <div className="mt-6 border-t pt-4">
                  <CorrespondenceComposer caseId={caseData.id} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card className="border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-950/10">
            <CardHeader>
              <CardTitle className="text-indigo-900 dark:text-indigo-200">Internal Investigation Notes</CardTitle>
              <CardDescription>Private staff communication. Not visible to reporters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {caseNotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No internal notes yet.</p>
                ) : (
                  caseNotes.map((note) => {
                    const sender = useAppStore.getState().users.find(u => u.id === note.senderId);
                    return (
                      <div key={note.id} className="flex gap-4">
                        <Avatar className="mt-1">
                          <AvatarFallback className="bg-indigo-200 text-indigo-900">{sender?.avatar || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">{sender?.name}</span>
                            <Badge variant="outline" className="text-[10px] h-4 px-1 py-0">{sender?.role}</Badge>
                            <span className="text-xs text-muted-foreground">{new Date(note.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="rounded-lg p-3 text-sm bg-white border border-indigo-100 shadow-sm dark:bg-indigo-950 dark:border-indigo-800">
                            {note.content}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-6 border-t border-indigo-100 dark:border-indigo-900 pt-4">
                 <InternalNoteComposer caseId={caseData.id} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Evidence & Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                <Paperclip className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="text-sm font-medium">Drag and drop files here, or click to upload</div>
                <Button variant="secondary">Browse Files</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calls" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Linked Call History</CardTitle>
            </CardHeader>
            <CardContent>
              {caseCalls.length === 0 ? (
                 <p className="text-sm text-muted-foreground text-center py-8">No calls linked to this case.</p>
              ) : (
                <div className="space-y-4">
                  {caseCalls.map(call => (
                    <div key={call.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <PhoneCall className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Hotline Call ({call.status})</p>
                          <p className="text-xs text-muted-foreground">{new Date(call.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{call.durationSeconds}s</Badge>
                        <Button variant="secondary" size="sm">Play Audio</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Audit Log</CardTitle>
              <CardDescription>Immutable record of all case activities.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 border-l-2 border-muted ml-3 pl-4">
                {caseAuditLogs.map((log) => {
                  const actor = log.actorId === 'System' ? 'System' : useAppStore.getState().users.find(u => u.id === log.actorId)?.name || 'Unknown User';
                  return (
                    <div key={log.id} className="relative">
                      <span className="absolute -left-6 top-1 h-4 w-4 rounded-full border-4 border-background bg-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1">{new Date(log.timestamp).toLocaleString()}</span>
                        <p className="text-sm">
                          <span className="font-medium">{actor}</span>: {log.action}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CorrespondenceComposer({ caseId }: { caseId: string }) {
  const [content, setContent] = useState('');
  const { addCorrespondence, activeUser } = useAppStore();

  if (!activeUser) return null;

  const handleSend = () => {
    if (!content.trim()) return;
    addCorrespondence({
      caseId,
      sender: {
        name: activeUser.name,
        email: `${activeUser.name.toLowerCase().replace(' ', '.')}@tari.com`,
        isStaff: true
      },
      content
    });
    setContent('');
    toast.success('Message sent to reporter');
  };

  return (
    <div className="space-y-3">
      <Textarea 
        placeholder="Type a secure reply to the reporter..." 
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end">
        <Button onClick={handleSend} disabled={!content.trim()}><Send className="mr-2 h-4 w-4" /> Send Reply</Button>
      </div>
    </div>
  );
}

function InternalNoteComposer({ caseId }: { caseId: string }) {
  const [content, setContent] = useState('');
  const { addInternalNote, activeUser } = useAppStore();

  if (!activeUser) return null;

  const handleSend = () => {
    if (!content.trim()) return;
    addInternalNote({
      caseId,
      senderId: activeUser.id,
      content
    });
    setContent('');
    toast.success('Internal note added');
  };

  return (
    <div className="space-y-3">
      <Textarea 
        placeholder="Add an internal note..." 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-white dark:bg-indigo-950 border-indigo-200"
      />
      <div className="flex justify-end">
        <Button onClick={handleSend} disabled={!content.trim()} className="bg-indigo-600 hover:bg-indigo-700">Add Note</Button>
      </div>
    </div>
  );
}

function TriageDialog({ caseId }: { caseId: string }) {
  const [open, setOpen] = useState(false);
  const { updateCase, users } = useAppStore();
  const [severity, setSeverity] = useState('Medium');
  const [category, setCategory] = useState('Workplace Conduct');
  const [department, setDepartment] = useState('Unassigned');
  const [assignee, setAssignee] = useState('');

  const handleTriage = () => {
    updateCase(caseId, {
      status: 'In Progress',
      severity: severity as any,
      category,
      department: department !== 'Unassigned' ? department : undefined,
      assigneeIds: assignee ? [assignee] : [],
    });
    setOpen(false);
    toast.success('Case triaged successfully');
  };

  const investigators = users.filter(u => u.role === 'Investigator' || u.role === 'Compliance Admin');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        Triage Case
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Triage Case</DialogTitle>
          <DialogDescription>
            Assign severity, category, and an investigator to begin the review.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="severity" className="text-right">Severity</Label>
            <div className="col-span-3">
              <Select value={severity} onValueChange={(val) => setSeverity(val || '')}>
                <SelectTrigger id="severity"><SelectValue placeholder="Select severity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <div className="col-span-3">
              <Select value={category} onValueChange={(val) => setCategory(val || '')}>
                <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financial Misconduct">Financial Misconduct</SelectItem>
                  <SelectItem value="Workplace Conduct">Workplace Conduct</SelectItem>
                  <SelectItem value="Conflict of Interest">Conflict of Interest</SelectItem>
                  <SelectItem value="Health & Safety">Health & Safety</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <div className="col-span-3">
              <Select value={department} onValueChange={(val) => setDepartment(val || '')}>
                <SelectTrigger id="department"><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right">Assignee</Label>
            <div className="col-span-3">
              <Select value={assignee} onValueChange={(val) => setAssignee(val || '')}>
                <SelectTrigger id="assignee"><SelectValue placeholder="Select investigator" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {investigators.map(inv => (
                    <SelectItem key={inv.id} value={inv.id}>{inv.name} ({inv.role})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleTriage}>Save Triage</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
