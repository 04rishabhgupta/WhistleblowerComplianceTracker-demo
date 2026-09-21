export type Role = 'SysAdmin' | 'Investigator';

export interface ClientOrganization {
  id: string;
  name: string;
  intakeEmail: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  avatar: string;
}

export type CaseStatus = 'Received' | 'Acknowledged' | 'Information Sought' | 'Under Analysis' | 'PAR Prepared' | 'Closed' | 'Re-opened';
export type CaseSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type CaseSource = 'Email' | 'Hotline';

export interface PAR {
  assessmentDetails: string;
  evidenceAnalyzed: string;
  recommendations: string;
  submittedAt: string;
}

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
  par?: PAR;
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

export interface Evidence {
  id: string;
  caseId: string;
  filename: string;
  fileSize: string; // e.g., "2.4 MB"
  uploadedBy: string | 'Reporter';
  timestamp: string;
  description?: string;
}

