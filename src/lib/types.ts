export type Role = 'Super Admin' | 'Compliance Admin' | 'Investigator';

export interface ClientOrganization {
  id: string;
  name: string;
  intakeEmail: string;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  department?: string;
  avatar: string;
}

export type CaseStatus = 'New — Needs Triage' | 'In Progress' | 'Under Investigation' | 'Resolved' | 'Closed';
export type CaseSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type CaseSource = 'Email' | 'Hotline';

export interface Case {
  id: string;
  caseNumber: string;
  organizationId: string;
  status: CaseStatus;
  severity?: CaseSeverity;
  category?: string;
  department?: string;
  incidentDate?: string;
  description: string;
  source: CaseSource;
  reporterEmail?: string;
  reporterPhone?: string;
  assigneeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Correspondence {
  id: string;
  caseId: string;
  sender: {
    name: string;
    email: string;
    isStaff: boolean;
  };
  content: string;
  timestamp: string;
}

export interface InternalNote {
  id: string;
  caseId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Call {
  id: string;
  callSid: string;
  durationSeconds: number;
  timestamp: string;
  status: 'Answered' | 'Missed' | 'Voicemail';
  caseId?: string; // If linked
}

export interface AuditLog {
  id: string;
  caseId: string;
  actorId: string | 'System';
  action: string;
  timestamp: string;
}
