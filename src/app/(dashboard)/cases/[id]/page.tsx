'use client';

import { useAppStore } from '@/lib/store';
import { notFound, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Clock, MessageSquare, Paperclip, PhoneCall, ShieldCheck, Mail, Send, Activity, Flag, Phone, FileText, CheckCircle2, Lock, Download, FileArchive } from 'lucide-react';
import Link from 'next/link';
import { useState, use } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const LIFECYCLE_STAGES = [
  'Received',
  'Acknowledged',
  'Information Sought',
  'Under Analysis',
  'PAR Prepared',
  'Closed'
];

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { cases, correspondences, internalNotes, auditLogs, calls, evidence, activeUser, organizations, addCorrespondence, addInternalNote, addEvidence } = useAppStore();
  const caseData = cases.find((c) => c.id === unwrappedParams.id);
  
  if (!caseData || !activeUser) return notFound();

  const organization = organizations.find(org => org.id === caseData.organizationId);

  const caseCorrespondences = correspondences.filter(c => c.caseId === caseData.id);
  const caseNotes = internalNotes.filter(n => n.caseId === caseData.id);
  const caseAuditLogs = auditLogs.filter(l => l.caseId === caseData.id);
  const caseCalls = calls.filter(c => c.caseId === caseData.id);
  const caseEvidence = evidence ? evidence.filter(e => e.caseId === caseData.id) : [];

  type TimelineEvent = {
    id: string;
    type: 'initiation' | 'mail' | 'call' | 'note' | 'evidence' | 'audit' | 'par';
    timestamp: string;
    title: string;
    description: string;
    actor: string;
  };

  // Synthesize all events into a unified timeline
  const timelineEvents: TimelineEvent[] = [
    {
      id: `init-${caseData.id}`,
      type: 'initiation' as const,
      timestamp: caseData.createdAt,
      title: 'Case Initiated',
      description: `Report securely submitted via ${caseData.source}.`,
      actor: caseData.reporterEmail || 'Anonymous'
    },
    ...caseCorrespondences.map(c => ({
      id: c.id,
      type: 'mail' as const,
      timestamp: c.timestamp,
      title: c.sender.isStaff ? 'Secure Message (Outgoing)' : 'Secure Message (Incoming)',
      description: c.content,
      actor: c.sender.name
    })),
    ...caseCalls.map(c => ({
      id: c.id,
      type: 'call' as const,
      timestamp: c.timestamp,
      title: `Hotline Call Intercepted`,
      description: `Call duration: ${c.durationSeconds}s. Status: ${c.status}`,
      actor: 'System Hotline'
    })),
    ...caseNotes.map(n => ({
      id: n.id,
      type: 'note' as const,
      timestamp: n.timestamp,
      title: 'Internal Investigation Note',
      description: n.content,
      actor: useAppStore.getState().users.find(u => u.id === n.senderId)?.name || 'Unknown Staff'
    })),
    ...caseEvidence.map(e => ({
      id: e.id,
      type: 'evidence' as const,
      timestamp: e.timestamp,
      title: 'Evidence Uploaded',
      description: `File: ${e.filename} (${e.fileSize}). Chain of custody logged.`,
      actor: e.uploadedBy === 'Reporter' ? 'Reporter' : (useAppStore.getState().users.find(u => u.id === e.uploadedBy)?.name || 'Staff')
    })),
    ...caseAuditLogs.map(l => ({
      id: l.id,
      type: 'audit' as const,
      timestamp: l.timestamp,
      title: 'System Audit Record',
      description: l.action,
      actor: l.actorId === 'System' ? 'System' : useAppStore.getState().users.find(u => u.id === l.actorId)?.name || 'Unknown User'
    }))
  ];

  if (caseData.par) {
    timelineEvents.push({
      id: `par-${caseData.id}`,
      type: 'par' as const,
      timestamp: caseData.par.submittedAt,
      title: 'Preliminary Assessment Report (PAR) Generated',
      description: 'Formal assessment report finalized and shared with the client organization.',
      actor: 'Investigation Team'
    });
  }

  // Sort strictly chronologically
  timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const currentStageIndex = caseData.status === 'Re-opened' ? 5 : LIFECYCLE_STAGES.indexOf(caseData.status);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-primary">Case {caseData.caseNumber}</h1>
            <Badge className="bg-amber-500">{caseData.status}</Badge>
            {caseData.severity && (
              <Badge variant={caseData.severity === 'Critical' ? 'destructive' : 'secondary'}>
                {caseData.severity} Priority
              </Badge>
            )}
            <Badge variant="outline" className="border-indigo-500 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Privileged & Confidential
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Reported via {caseData.source} on {new Date(caseData.createdAt).toLocaleDateString()}</p>
        </div>
        {activeUser.role === 'Investigator' && (
          <UpdateStatusDialog caseId={caseData.id} currentStatus={caseData.status} />
        )}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {LIFECYCLE_STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isReopened = caseData.status === 'Re-opened';
              return (
                <div key={stage} className="flex flex-col items-center flex-1 relative">
                  {idx !== 0 && (
                    <div className={`absolute top-4 -left-[50%] w-full h-[2px] ${isCompleted || isCurrent ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
                  )}
                  <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background ${
                    isCompleted ? 'border-indigo-600 text-indigo-600' : 
                    isCurrent ? (isReopened ? 'border-orange-500 text-orange-500' : 'border-indigo-600 bg-indigo-600 text-white') : 
                    'border-slate-300 text-slate-300 dark:border-slate-700 dark:text-slate-700'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-medium">{idx + 1}</span>}
                  </div>
                  <span className={`mt-2 text-xs font-medium text-center ${isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {stage}
                  </span>
                  {isReopened && isCurrent && stage === 'Closed' && (
                    <span className="mt-1 text-[10px] text-orange-500 font-bold">RE-OPENED</span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7 lg:w-[900px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="correspondence">Correspondence</TabsTrigger>
          <TabsTrigger value="notes">Internal Notes</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="par">Assessment (PAR)</TabsTrigger>
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
          
          <Card className="mt-6 border-slate-300 dark:border-slate-800">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b pb-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-500" /> Unified Forensic Timeline
              </CardTitle>
              <CardDescription>Immutable chronological record of all case events, evidence, and correspondence.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4 mt-2">
                {timelineEvents.map((event) => {
                  let Icon = Activity;
                  let colorClass = "text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400";
                  
                  if (event.type === 'initiation') {
                    Icon = Flag;
                    colorClass = "text-teal-600 bg-teal-50 border-teal-200 dark:bg-teal-950 dark:border-teal-900 dark:text-teal-400";
                  } else if (event.type === 'mail') {
                    Icon = Mail;
                    colorClass = "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-400";
                  } else if (event.type === 'call') {
                    Icon = Phone;
                    colorClass = "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-900 dark:text-purple-400";
                  } else if (event.type === 'audit') {
                    Icon = ShieldCheck;
                    colorClass = "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-500";
                  } else if (event.type === 'note') {
                    Icon = Lock;
                    colorClass = "text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-400";
                  } else if (event.type === 'evidence') {
                    Icon = Paperclip;
                    colorClass = "text-cyan-600 bg-cyan-50 border-cyan-200 dark:bg-cyan-950 dark:border-cyan-900 dark:text-cyan-400";
                  } else if (event.type === 'par') {
                    Icon = FileText;
                    colorClass = "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-400";
                  }

                  return (
                    <div key={event.id} className="relative pl-8">
                      <span className={`absolute -left-[17px] flex h-8 w-8 items-center justify-center rounded-full border-2 ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className={`flex flex-col p-4 rounded-lg border ${event.type === 'note' ? 'bg-indigo-50/30 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50' : 'bg-card border-border shadow-sm'}`}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-foreground text-sm flex items-center gap-2">
                            {event.title}
                            {event.type === 'note' && <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-indigo-200 text-indigo-500">PRIVILEGED</Badge>}
                            {event.type === 'audit' && <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-amber-200 text-amber-500">SYSTEM</Badge>}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {new Date(event.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed whitespace-pre-wrap">
                          {event.description}
                        </p>
                        {event.actor && (
                          <div className="mt-3 flex items-center gap-2 border-t pt-2 border-border/50">
                            <span className="text-xs font-medium text-muted-foreground">
                              Actor: <span className="text-foreground">{event.actor}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
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
                  caseCorrespondences.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((msg) => (
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
              
              {caseData.status !== 'Closed' && caseData.status !== 'Received' && (
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
              <CardTitle className="text-indigo-900 dark:text-indigo-200 flex items-center gap-2"><Lock className="h-5 w-5" /> Internal Investigation Notes</CardTitle>
              <CardDescription>Private staff communication protected under attorney-client privilege. Not visible to reporters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {caseNotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No internal notes yet.</p>
                ) : (
                  caseNotes.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((note) => {
                    const sender = useAppStore.getState().users.find(u => u.id === note.senderId);
                    return (
                      <div key={note.id} className="flex gap-4">
                        <Avatar className="mt-1">
                          <AvatarFallback className="bg-indigo-200 text-indigo-900">{sender?.avatar || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col w-full">
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
              <CardDescription>Files uploaded by the reporter or investigators. Chain of custody is strictly maintained.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {caseEvidence.length === 0 ? (
                <div className="text-center py-12">
                  <FileArchive className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No evidence files have been uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {caseEvidence.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(ev => {
                     const uploaderName = ev.uploadedBy === 'Reporter' ? 'Reporter' : (useAppStore.getState().users.find(u => u.id === ev.uploadedBy)?.name || 'Staff');
                     return (
                      <div key={ev.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                            <Paperclip className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{ev.filename}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{ev.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">Uploaded by {uploaderName} • {ev.fileSize} • {new Date(ev.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Download</Button>
                      </div>
                     );
                  })}
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-dashed">
                <EvidenceUploader caseId={caseData.id} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="par" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-emerald-500" /> Preliminary Assessment Report (PAR)</CardTitle>
              <CardDescription>Formal assessment details and recommendations shared with the client company.</CardDescription>
            </CardHeader>
            <CardContent>
              {caseData.par ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">Assessment Details</h3>
                    <div className="bg-muted/50 p-4 rounded-md border text-sm whitespace-pre-wrap">{caseData.par.assessmentDetails}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">Evidence Analyzed</h3>
                    <div className="bg-muted/50 p-4 rounded-md border text-sm whitespace-pre-wrap">{caseData.par.evidenceAnalyzed}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">Recommendations</h3>
                    <div className="bg-muted/50 p-4 rounded-md border text-sm whitespace-pre-wrap">{caseData.par.recommendations}</div>
                  </div>
                  <div className="text-xs text-muted-foreground pt-4 border-t flex items-center justify-between">
                    <span><strong>PAR Submitted:</strong> {new Date(caseData.par.submittedAt).toLocaleString()}</span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Officially Distributed</Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No Preliminary Assessment Report has been generated yet.</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Change the case status to "PAR Prepared" to generate the report.</p>
                </div>
              )}
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

function EvidenceUploader({ caseId }: { caseId: string }) {
  const { addEvidence, activeUser } = useAppStore();
  const [filename, setFilename] = useState('');
  
  if (!activeUser) return null;
  
  const handleUpload = () => {
    if (!filename.trim()) return;
    addEvidence({
      caseId,
      filename: filename.trim(),
      fileSize: '1.2 MB',
      uploadedBy: activeUser.id,
      description: 'Manually uploaded via dashboard.'
    });
    setFilename('');
    toast.success('Evidence file uploaded securely.');
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Label htmlFor="ev-file" className="sr-only">Mock Filename</Label>
        <input 
          id="ev-file"
          type="text" 
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Enter mock filename (e.g. ledger.pdf)" 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <Button onClick={handleUpload} disabled={!filename.trim()}>Upload Mock File</Button>
    </div>
  );
}

function UpdateStatusDialog({ caseId, currentStatus }: { caseId: string, currentStatus: string }) {
  const [open, setOpen] = useState(false);
  const { updateCase, users, addAuditLog } = useAppStore();
  
  const [status, setStatus] = useState(currentStatus);
  const [severity, setSeverity] = useState('Medium');
  const [category, setCategory] = useState('Workplace Conduct');
  const [department, setDepartment] = useState('Unassigned');
  const [assignee, setAssignee] = useState('');
  
  // PAR State
  const [assessmentDetails, setAssessmentDetails] = useState('');
  const [evidenceAnalyzed, setEvidenceAnalyzed] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const handleUpdate = () => {
    const updatePayload: any = {
      status: status as any,
    };
    
    if (currentStatus === 'Received' && status !== 'Received') {
      updatePayload.severity = severity as any;
      updatePayload.category = category;
      updatePayload.department = department !== 'Unassigned' ? department : undefined;
      updatePayload.assigneeIds = assignee ? [assignee] : [];
    }

    if (status === 'PAR Prepared') {
      updatePayload.par = {
        assessmentDetails,
        evidenceAnalyzed,
        recommendations,
        submittedAt: new Date().toISOString()
      };
    }

    updateCase(caseId, updatePayload);
    
    // Explicitly add an audit log if advancing to a specific stage to match client request wording
    if (status === 'Acknowledged') {
       addAuditLog({ caseId, actorId: useAppStore.getState().activeUser?.id || 'System', action: 'Acknowledged to the complainant and company is informed about the complaint (identity withheld).' });
    } else if (status === 'Information Sought') {
       addAuditLog({ caseId, actorId: useAppStore.getState().activeUser?.id || 'System', action: 'Conversation with the complainant is commenced and additional information and evidence is sought.' });
    } else if (status === 'Under Analysis') {
       addAuditLog({ caseId, actorId: useAppStore.getState().activeUser?.id || 'System', action: 'Complaint and evidence is analyzed.' });
    } else if (status === 'PAR Prepared') {
       addAuditLog({ caseId, actorId: useAppStore.getState().activeUser?.id || 'System', action: 'Preliminary assessment report (PAR) is prepared with recommendations on how to address the complaint and shared with the company.' });
    } else if (status === 'Closed') {
       addAuditLog({ caseId, actorId: useAppStore.getState().activeUser?.id || 'System', action: 'Complaint is closed from TAC after submission of PAR.' });
    }
    
    setOpen(false);
    toast.success('Case updated successfully');
  };

  const investigators = users.filter(u => u.role === 'Investigator');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        Update Status
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Case Status</DialogTitle>
          <DialogDescription>
            Advance the case through the compliance lifecycle.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">New Status</Label>
            <div className="col-span-3">
              <Select value={status} onValueChange={(val) => setStatus(val || '')}>
                <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="Information Sought">Information Sought</SelectItem>
                  <SelectItem value="Under Analysis">Under Analysis</SelectItem>
                  <SelectItem value="PAR Prepared">PAR Prepared</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Re-opened">Re-opened</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {currentStatus === 'Received' && status !== 'Received' && (
            <>
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
            </>
          )}

          {status === 'PAR Prepared' && (
            <div className="space-y-4 mt-4 border-t pt-4">
              <h3 className="font-semibold text-lg text-primary">Preliminary Assessment Report</h3>
              <div className="space-y-2">
                <Label htmlFor="assessment">Assessment Details</Label>
                <Textarea id="assessment" value={assessmentDetails} onChange={e => setAssessmentDetails(e.target.value)} rows={3} placeholder="Provide details of the assessment..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidence">Evidence Analyzed</Label>
                <Textarea id="evidence" value={evidenceAnalyzed} onChange={e => setEvidenceAnalyzed(e.target.value)} rows={3} placeholder="Summarize the evidence that was reviewed..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recommendations">Recommendations</Label>
                <Textarea id="recommendations" value={recommendations} onChange={e => setRecommendations(e.target.value)} rows={3} placeholder="List recommendations to address the complaint..." />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate}>Update Case</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
