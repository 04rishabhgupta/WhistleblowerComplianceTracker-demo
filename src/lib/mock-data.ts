import { User, Case, Correspondence, InternalNote, Call, AuditLog, ClientOrganization } from './types';
import { subDays, subHours, subMinutes, formatISO } from 'date-fns';

const now = new Date();

export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Priya Sharma',
    role: 'Super Admin',
    department: 'Executive',
    avatar: 'PS',
  },
  {
    id: 'user_2',
    name: 'Rohan Mehta',
    role: 'Compliance Admin',
    department: 'Legal & Compliance',
    avatar: 'RM',
  },
  {
    id: 'user_3',
    name: 'Ananya Rao',
    role: 'Investigator',
    department: 'HR',
    avatar: 'AR',
  },
  {
    id: 'user_4',
    name: 'Vikram Singh',
    role: 'Investigator',
    department: 'Finance',
    avatar: 'VS',
  },
];

export const MOCK_ORGANIZATIONS: ClientOrganization[] = [
  { id: 'org_1', name: 'Acme Corp', intakeEmail: 'acmecorp@tari.co.in' },
  { id: 'org_2', name: 'Globex Inc', intakeEmail: 'globex@tari.co.in' },
  { id: 'org_3', name: 'Stark Industries', intakeEmail: 'stark@tari.co.in' },
];

export const MOCK_CASES: Case[] = [
  {
    id: 'case_1',
    caseNumber: 'TARI-2023-0042',
    organizationId: 'org_1',
    status: 'New — Needs Triage',
    description: 'I am concerned about some recent expense reports filed by the regional sales team. Several large entertainment expenses lack proper receipts and seem unusually high for the reported client meetings.',
    source: 'Email',
    reporterEmail: 'whistleblower_xyz@protonmail.com',
    assigneeIds: [],
    createdAt: formatISO(subHours(now, 2)),
    updatedAt: formatISO(subHours(now, 2)),
  },
  {
    id: 'case_2',
    caseNumber: 'TARI-2023-0041',
    organizationId: 'org_2',
    status: 'In Progress',
    severity: 'High',
    category: 'Workplace Conduct',
    department: 'Marketing',
    incidentDate: formatISO(subDays(now, 5)),
    description: 'Received via hotline. Caller reported ongoing harassment by a senior manager during team meetings. Wants to remain completely anonymous.',
    source: 'Phone Hotline',
    assigneeIds: ['user_2', 'user_3'],
    createdAt: formatISO(subDays(now, 2)),
    updatedAt: formatISO(subHours(now, 1)),
  },
  {
    id: 'case_3',
    caseNumber: 'TARI-2023-0040',
    organizationId: 'org_3',
    status: 'Under Investigation',
    severity: 'Critical',
    category: 'Financial Misconduct',
    department: 'Finance',
    incidentDate: formatISO(subDays(now, 14)),
    description: 'Discovered discrepancies in the Q3 vendor payouts. Payments were routed to an unapproved vendor entity in Singapore.',
    source: 'Email',
    reporterEmail: 'audit_alert@tari-ethics.com',
    assigneeIds: ['user_2', 'user_4'],
    createdAt: formatISO(subDays(now, 10)),
    updatedAt: formatISO(subDays(now, 1)),
  },
  {
    id: 'case_4',
    caseNumber: 'TARI-2023-0039',
    organizationId: 'org_1',
    status: 'Resolved',
    severity: 'Medium',
    category: 'Conflict of Interest',
    department: 'Procurement',
    description: 'A procurement officer awarded a contract to a firm owned by their brother-in-law without disclosing the relationship.',
    source: 'Web Portal',
    assigneeIds: ['user_2'],
    createdAt: formatISO(subDays(now, 20)),
    updatedAt: formatISO(subDays(now, 5)),
  },
  {
    id: 'case_5',
    caseNumber: 'TARI-2023-0043',
    organizationId: 'org_2',
    status: 'New — Needs Triage',
    description: 'Someone has been leaving the secure server room door propped open after hours.',
    source: 'Phone Hotline',
    assigneeIds: [],
    createdAt: formatISO(subMinutes(now, 45)),
    updatedAt: formatISO(subMinutes(now, 45)),
  }
];

export const MOCK_CORRESPONDENCE: Correspondence[] = [
  {
    id: 'corr_1',
    caseId: 'case_1',
    sender: { name: 'Whistleblower', email: 'whistleblower_xyz@protonmail.com', isStaff: false },
    content: 'I am concerned about some recent expense reports filed by the regional sales team. Several large entertainment expenses lack proper receipts and seem unusually high for the reported client meetings.',
    timestamp: formatISO(subHours(now, 2)),
  },
  {
    id: 'corr_2',
    caseId: 'case_3',
    sender: { name: 'System', email: 'speak-up@tari-ethics.com', isStaff: false },
    content: 'Discovered discrepancies in the Q3 vendor payouts. Payments were routed to an unapproved vendor entity in Singapore.',
    timestamp: formatISO(subDays(now, 10)),
  },
  {
    id: 'corr_3',
    caseId: 'case_3',
    sender: { name: 'Rohan Mehta', email: 'rohan.mehta@tari.com', isStaff: true },
    content: 'Thank you for your report. We take these matters seriously. Can you provide the names of the specific vendor entities involved?',
    timestamp: formatISO(subDays(now, 9)),
  },
  {
    id: 'corr_4',
    caseId: 'case_3',
    sender: { name: 'System', email: 'audit_alert@tari-ethics.com', isStaff: false },
    content: 'The vendor in question is listed as "Apex Consulting Pte Ltd".',
    timestamp: formatISO(subDays(now, 8)),
  }
];

export const MOCK_INTERNAL_NOTES: InternalNote[] = [
  {
    id: 'note_1',
    caseId: 'case_2',
    senderId: 'user_2',
    content: 'Assigned Ananya from HR to assist with this conduct issue. Given the sensitivity, we need to interview the reporter carefully without exposing their identity.',
    timestamp: formatISO(subDays(now, 1)),
  },
  {
    id: 'note_2',
    caseId: 'case_2',
    senderId: 'user_3',
    content: 'I will prepare an interview script and reach out via the secure portal today.',
    timestamp: formatISO(subHours(now, 10)),
  },
  {
    id: 'note_3',
    caseId: 'case_3',
    senderId: 'user_4',
    content: 'I have pulled the AP logs for Q3. There are indeed 3 transactions matching this description totaling $45,000.',
    timestamp: formatISO(subDays(now, 3)),
  }
];

export const MOCK_CALLS: Call[] = [
  {
    id: 'call_1',
    callSid: 'CA1234567890abcdef1234567890abcdef',
    durationSeconds: 145,
    timestamp: formatISO(subDays(now, 2)),
    status: 'Voicemail',
    caseId: 'case_2'
  },
  {
    id: 'call_2',
    callSid: 'CA0987654321fedcba0987654321fedcba',
    durationSeconds: 42,
    timestamp: formatISO(subMinutes(now, 45)),
    status: 'Voicemail',
    caseId: 'case_5'
  },
  {
    id: 'call_3',
    callSid: 'CA55555555555555555555555555555555',
    durationSeconds: 12,
    timestamp: formatISO(subMinutes(now, 15)),
    status: 'Missed',
  },
  {
    id: 'call_4',
    callSid: 'CA77777777777777777777777777777777',
    durationSeconds: 305,
    timestamp: formatISO(subHours(now, 5)),
    status: 'Answered',
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_1',
    caseId: 'case_1',
    actorId: 'System',
    action: 'Case automatically created from Email intake.',
    timestamp: formatISO(subHours(now, 2)),
  },
  {
    id: 'audit_2',
    caseId: 'case_2',
    actorId: 'System',
    action: 'Case created from Hotline intake. Call SID: CA123...',
    timestamp: formatISO(subDays(now, 2)),
  },
  {
    id: 'audit_3',
    caseId: 'case_2',
    actorId: 'user_2',
    action: 'Triaged case. Set severity to High, category to Workplace Conduct.',
    timestamp: formatISO(subDays(now, 1)),
  },
  {
    id: 'audit_4',
    caseId: 'case_2',
    actorId: 'user_2',
    action: 'Assigned user_3 (Ananya Rao) to the case.',
    timestamp: formatISO(subDays(now, 1)),
  }
];
