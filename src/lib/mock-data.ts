import { User, Case, Correspondence, InternalNote, Call, AuditLog, ClientOrganization } from './types';
import { subMonths, subDays, subHours, subMinutes, formatISO } from 'date-fns';

const now = new Date();

export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Platform Admin',
    email: 'sys-admin@tari.co.in',
    role: 'SysAdmin',
    department: 'Platform Admin',
    avatar: 'PA',
  },
  {
    id: 'user_2',
    name: 'Lead Investigator',
    email: 'lead.investigator@tari.co.in',
    role: 'Investigator',
    department: 'Legal & Compliance',
    avatar: 'LI',
  },
  {
    id: 'user_3',
    name: 'HR Investigator',
    email: 'hr.investigator@tari.co.in',
    role: 'Investigator',
    department: 'HR Compliance',
    avatar: 'HI',
  },
  {
    id: 'user_4',
    name: 'Financial Auditor',
    email: 'financial.auditor@tari.co.in',
    role: 'Investigator',
    department: 'Financial Audit',
    avatar: 'FA',
  }
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
    organizationId: 'org_1',
    status: 'In Progress',
    severity: 'High',
    category: 'Workplace Conduct',
    department: 'Marketing',
    incidentDate: formatISO(subDays(now, 5)),
    description: 'Received via hotline. Caller reported ongoing harassment by a senior manager during team meetings. Wants to remain completely anonymous.',
    source: 'Hotline',
    assigneeIds: ['user_2', 'user_3'],
    createdAt: formatISO(subDays(now, 15)),
    updatedAt: formatISO(subHours(now, 1)),
  },
  {
    id: 'case_3',
    caseNumber: 'TARI-2023-0020',
    organizationId: 'org_1',
    status: 'Resolved',
    severity: 'Low',
    category: 'Health & Safety',
    department: 'Operations',
    incidentDate: formatISO(subMonths(now, 2)),
    description: 'Fire exits in warehouse B are frequently blocked by new inventory pallets. I have brought this up with management but nothing changed.',
    source: 'Email',
    reporterEmail: 'anon_ops@gmail.com',
    assigneeIds: ['user_2'],
    createdAt: formatISO(subMonths(now, 1.5)),
    updatedAt: formatISO(subDays(now, 5)),
  },
  {
    id: 'case_4',
    caseNumber: 'TARI-2023-0035',
    organizationId: 'org_2',
    status: 'Under Investigation',
    severity: 'Critical',
    category: 'Financial Misconduct',
    department: 'Finance',
    incidentDate: formatISO(subDays(now, 45)),
    description: 'Discovered discrepancies in the Q3 vendor payouts. Payments were routed to an unapproved vendor entity in Singapore.',
    source: 'Email',
    reporterEmail: 'audit_alert@tari-ethics.com',
    assigneeIds: ['user_2', 'user_4'],
    createdAt: formatISO(subDays(now, 30)),
    updatedAt: formatISO(subDays(now, 1)),
  },
  {
    id: 'case_5',
    caseNumber: 'TARI-2023-0010',
    organizationId: 'org_2',
    status: 'Closed',
    severity: 'Medium',
    category: 'Data Privacy',
    department: 'IT',
    incidentDate: formatISO(subMonths(now, 4)),
    description: 'Customer data was exported to an unencrypted flash drive by a departing employee in the analytics department.',
    source: 'Hotline',
    assigneeIds: ['user_1', 'user_2'],
    createdAt: formatISO(subMonths(now, 3)),
    updatedAt: formatISO(subMonths(now, 1)),
  },
  {
    id: 'case_6',
    caseNumber: 'TARI-2023-0045',
    organizationId: 'org_2',
    status: 'In Progress',
    severity: 'Medium',
    category: 'Conflict of Interest',
    department: 'Procurement',
    incidentDate: formatISO(subDays(now, 20)),
    description: 'A procurement officer awarded a contract to a firm owned by their brother-in-law without disclosing the relationship during the vendor selection process.',
    source: 'Email',
    reporterEmail: 'procurement_insider@securemail.com',
    assigneeIds: ['user_2', 'user_4'],
    createdAt: formatISO(subDays(now, 12)),
    updatedAt: formatISO(subDays(now, 2)),
  },
  {
    id: 'case_7',
    caseNumber: 'TARI-2023-0018',
    organizationId: 'org_3',
    status: 'Resolved',
    severity: 'Critical',
    category: 'Environmental',
    department: 'Manufacturing',
    incidentDate: formatISO(subMonths(now, 5)),
    description: 'Chemical waste is being improperly disposed of into the municipal drain near the north factory wall during the night shift.',
    source: 'Hotline',
    assigneeIds: ['user_2', 'user_3'],
    createdAt: formatISO(subMonths(now, 4.5)),
    updatedAt: formatISO(subMonths(now, 2)),
  },
  {
    id: 'case_8',
    caseNumber: 'TARI-2023-0048',
    organizationId: 'org_3',
    status: 'New — Needs Triage',
    severity: 'Low',
    category: 'Physical Security',
    department: 'Facilities',
    description: 'Someone has been leaving the secure server room door propped open after hours on weekends. This is a huge physical security risk.',
    source: 'Hotline',
    assigneeIds: [],
    createdAt: formatISO(subMinutes(now, 45)),
    updatedAt: formatISO(subMinutes(now, 45)),
  },
  {
    id: 'case_9',
    caseNumber: 'TARI-2023-0038',
    organizationId: 'org_3',
    status: 'Under Investigation',
    severity: 'Medium',
    category: 'Workplace Conduct',
    department: 'Sales',
    incidentDate: formatISO(subDays(now, 60)),
    description: 'The regional manager is forcing team members to work off-the-clock during weekends to meet quotas, threatening retaliation if HR is informed.',
    source: 'Email',
    reporterEmail: 'tired_sales@proton.me',
    assigneeIds: ['user_3'],
    createdAt: formatISO(subDays(now, 25)),
    updatedAt: formatISO(subDays(now, 10)),
  },
  {
    id: 'case_10',
    caseNumber: 'TARI-2023-0044',
    organizationId: 'org_3',
    status: 'In Progress',
    severity: 'High',
    category: 'Theft/Fraud',
    department: 'Logistics',
    incidentDate: formatISO(subDays(now, 10)),
    description: 'High-value electronics are disappearing from outbound shipments before reaching the courier. I suspect the loading dock supervisor is involved.',
    source: 'Hotline',
    assigneeIds: ['user_2', 'user_4'],
    createdAt: formatISO(subDays(now, 5)),
    updatedAt: formatISO(subHours(now, 12)),
  }
];

export const MOCK_CORRESPONDENCE: Correspondence[] = [
  // Case 1 Correspondence
  { id: 'corr_1', caseId: 'case_1', sender: { name: 'Whistleblower', email: 'whistleblower_xyz@protonmail.com', isStaff: false }, content: 'I am concerned about some recent expense reports filed by the regional sales team. Several large entertainment expenses lack proper receipts.', timestamp: formatISO(subHours(now, 2)) },
  
  // Case 2 Correspondence
  { id: 'corr_2', caseId: 'case_2', sender: { name: 'Hotline Transcriber', email: 'system@tari.co.in', isStaff: true }, content: 'Caller stated that the marketing director frequently makes inappropriate comments about female colleagues\' appearances during Monday standups. Caller refused to leave a name for fear of being fired.', timestamp: formatISO(subDays(now, 15)) },
  { id: 'corr_3', caseId: 'case_2', sender: { name: 'HR Investigator', email: 'hr.investigator@tari.co.in', isStaff: true }, content: 'We need to speak with you to gather more specifics. We can assure you full anonymity. Could you share dates or specific quotes that were used?', timestamp: formatISO(subDays(now, 14)) },
  { id: 'corr_4', caseId: 'case_2', sender: { name: 'Anonymous', email: 'anon123@secure.com', isStaff: false }, content: 'Last Monday, he said some things about my dress. I will upload a recording of the meeting if you can guarantee he won\'t know it came from me.', timestamp: formatISO(subDays(now, 10)) },
  { id: 'corr_5', caseId: 'case_2', sender: { name: 'HR Investigator', email: 'hr.investigator@tari.co.in', isStaff: true }, content: 'You have our guarantee. Please upload the recording via this secure drop-link.', timestamp: formatISO(subDays(now, 9)) },
  
  // Case 4 Correspondence
  { id: 'corr_6', caseId: 'case_4', sender: { name: 'System', email: 'audit_alert@tari-ethics.com', isStaff: false }, content: 'Discovered discrepancies in the Q3 vendor payouts. Payments were routed to an unapproved vendor entity in Singapore.', timestamp: formatISO(subDays(now, 30)) },
  { id: 'corr_7', caseId: 'case_4', sender: { name: 'Financial Auditor', email: 'financial.auditor@tari.co.in', isStaff: true }, content: 'Thank you for your report. We take these matters seriously. Can you provide the names of the specific vendor entities involved?', timestamp: formatISO(subDays(now, 29)) },
  { id: 'corr_8', caseId: 'case_4', sender: { name: 'Audit Team', email: 'audit_alert@tari-ethics.com', isStaff: false }, content: 'The vendor in question is listed as "Apex Consulting Pte Ltd". Total routed was $450,000 across 3 wire transfers.', timestamp: formatISO(subDays(now, 28)) },
  { id: 'corr_9', caseId: 'case_4', sender: { name: 'Financial Auditor', email: 'financial.auditor@tari.co.in', isStaff: true }, content: 'Understood. We are freezing accounts associated with that vendor while we investigate.', timestamp: formatISO(subDays(now, 25)) },
  
  // Case 5 Correspondence
  { id: 'corr_10', caseId: 'case_5', sender: { name: 'Hotline Transcriber', email: 'system@tari.co.in', isStaff: true }, content: 'Caller witnessed IT admin John Doe downloading a massive SQL dump of user data onto a personal USB drive on his last day of work.', timestamp: formatISO(subMonths(now, 3)) },
  { id: 'corr_11', caseId: 'case_5', sender: { name: 'Platform Admin', email: 'sys-admin@tari.co.in', isStaff: true }, content: 'We are initiating an emergency DLP audit. Thank you for reporting this immediately.', timestamp: formatISO(subDays(subMonths(now, 3), -1)) },
  { id: 'corr_12', caseId: 'case_5', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: 'Update: We have engaged legal counsel and sent a cease-and-desist letter to the former employee. The drive was surrendered.', timestamp: formatISO(subMonths(now, 2)) },
  
  // Case 7 Correspondence
  { id: 'corr_13', caseId: 'case_7', sender: { name: 'Hotline Transcriber', email: 'system@tari.co.in', isStaff: true }, content: 'Night shift worker reported that the new solvent used in the painting bay is being dumped straight into the drain instead of the hazmat barrels.', timestamp: formatISO(subMonths(now, 4.5)) },
  { id: 'corr_14', caseId: 'case_7', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: 'Can you specify which bay and who gave the order to dump the solvent?', timestamp: formatISO(subDays(subMonths(now, 4.5), -1)) },
  { id: 'corr_15', caseId: 'case_7', sender: { name: 'Anonymous Worker', email: 'night_shift_anon@gmail.com', isStaff: false }, content: 'Bay 4. The shift supervisor, Mark, said the barrels were too expensive to replace weekly.', timestamp: formatISO(subDays(subMonths(now, 4.5), -5)) },
  
  // Case 9 Correspondence
  { id: 'corr_16', caseId: 'case_9', sender: { name: 'Sales Rep', email: 'tired_sales@proton.me', isStaff: false }, content: 'I have text messages from the regional manager demanding we log off the time tracking software but continue making cold calls on Saturdays.', timestamp: formatISO(subDays(now, 25)) },
  { id: 'corr_17', caseId: 'case_9', sender: { name: 'HR Investigator', email: 'hr.investigator@tari.co.in', isStaff: true }, content: 'Please upload screenshots of these text messages to the portal securely.', timestamp: formatISO(subDays(now, 24)) },
  { id: 'corr_18', caseId: 'case_9', sender: { name: 'Sales Rep', email: 'tired_sales@proton.me', isStaff: false }, content: 'Uploaded 4 screenshots. Please keep my name out of this, I need this job.', timestamp: formatISO(subDays(now, 22)) }
];

export const MOCK_INTERNAL_NOTES: InternalNote[] = [
  // Case 2 Notes
  { id: 'note_1', caseId: 'case_2', senderId: 'user_2', content: 'Assigned HR Investigator to assist with this conduct issue. Given the sensitivity, we need to interview the reporter carefully without exposing their identity.', timestamp: formatISO(subDays(now, 14)) },
  { id: 'note_2', caseId: 'case_2', senderId: 'user_3', content: 'I will prepare an interview script and reach out via the secure portal today.', timestamp: formatISO(subHours(now, 10)) },
  
  // Case 4 Notes
  { id: 'note_3', caseId: 'case_4', senderId: 'user_4', content: 'I have pulled the AP logs for Q3. There are indeed 3 transactions matching this description totaling $450,000.', timestamp: formatISO(subDays(now, 28)) },
  { id: 'note_4', caseId: 'case_4', senderId: 'user_4', content: 'I checked the company registry in Singapore. The company was incorporated only 4 months ago, and the registered director shares a last name with our VP of Sales.', timestamp: formatISO(subDays(now, 20)) },
  { id: 'note_5', caseId: 'case_4', senderId: 'user_2', content: 'Good catch. I am escalating this to the board ethics committee immediately.', timestamp: formatISO(subDays(now, 19)) },
  
  // Case 5 Notes
  { id: 'note_6', caseId: 'case_5', senderId: 'user_1', content: 'DLP logs confirm a 4GB data transfer over USB on the employee\'s final day. Engaging external forensic team.', timestamp: formatISO(subMonths(now, 3)) },
  
  // Case 6 Notes
  { id: 'note_7', caseId: 'case_6', senderId: 'user_2', content: 'Reviewed the procurement files. The conflict of interest declaration form was left entirely blank by the officer in question.', timestamp: formatISO(subDays(now, 10)) },
  
  // Case 7 Notes
  { id: 'note_8', caseId: 'case_7', senderId: 'user_3', content: 'Environmental audit completed. Soil samples near the drain show high levels of the specific VOCs used in the new solvent.', timestamp: formatISO(subMonths(now, 3)) },
  { id: 'note_9', caseId: 'case_7', senderId: 'user_2', content: 'Closing case. The supervisor was terminated and the company self-reported the violation to the EPA, paying the associated fines.', timestamp: formatISO(subMonths(now, 2)) }
];

export const MOCK_CALLS: Call[] = [
  // Linked calls
  { id: 'call_1', callSid: 'CA1234567890abcdef1234567890abcdef', durationSeconds: 145, timestamp: formatISO(subDays(now, 15)), status: 'Voicemail', caseId: 'case_2' },
  { id: 'call_2', callSid: 'CA0987654321fedcba0987654321fedcba', durationSeconds: 42, timestamp: formatISO(subMinutes(now, 45)), status: 'Voicemail', caseId: 'case_8' },
  { id: 'call_3', callSid: 'CA55555555555555555555555555555555', durationSeconds: 654, timestamp: formatISO(subMonths(now, 3)), status: 'Answered', caseId: 'case_5' },
  { id: 'call_4', callSid: 'CA66666666666666666666666666666666', durationSeconds: 231, timestamp: formatISO(subMonths(now, 4.5)), status: 'Voicemail', caseId: 'case_7' },
  { id: 'call_5', callSid: 'CA88888888888888888888888888888888', durationSeconds: 412, timestamp: formatISO(subDays(now, 5)), status: 'Answered', caseId: 'case_10' },

  // Unlinked/recent calls for the dashboard
  { id: 'call_6', callSid: 'CA77777777777777777777777777777777', durationSeconds: 305, timestamp: formatISO(subHours(now, 1)), status: 'Answered' },
  { id: 'call_7', callSid: 'CA99999999999999999999999999999999', durationSeconds: 12, timestamp: formatISO(subMinutes(now, 15)), status: 'Missed' },
  { id: 'call_8', callSid: 'CAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', durationSeconds: 88, timestamp: formatISO(subHours(now, 4)), status: 'Voicemail' },
  { id: 'call_9', callSid: 'CAbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', durationSeconds: 156, timestamp: formatISO(subHours(now, 24)), status: 'Answered' },
  { id: 'call_10', callSid: 'CAcccccccccccccccccccccccccccccccc', durationSeconds: 45, timestamp: formatISO(subDays(now, 2)), status: 'Voicemail' },
  { id: 'call_11', callSid: 'CAdddddddddddddddddddddddddddddddd', durationSeconds: 22, timestamp: formatISO(subDays(now, 3)), status: 'Missed' },
  { id: 'call_12', callSid: 'CAeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', durationSeconds: 610, timestamp: formatISO(subDays(now, 4)), status: 'Answered' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  // Case 1
  { id: 'audit_1', caseId: 'case_1', actorId: 'System', action: 'Case automatically created from Email intake.', timestamp: formatISO(subHours(now, 2)) },
  
  // Case 2
  { id: 'audit_2', caseId: 'case_2', actorId: 'System', action: 'Case created from Hotline intake. Call SID: CA123...', timestamp: formatISO(subDays(now, 15)) },
  { id: 'audit_3', caseId: 'case_2', actorId: 'user_2', action: 'Triaged case. Set severity to High, category to Workplace Conduct.', timestamp: formatISO(subDays(now, 14)) },
  { id: 'audit_4', caseId: 'case_2', actorId: 'user_2', action: 'Assigned user_3 (HR Investigator) to the case.', timestamp: formatISO(subDays(now, 14)) },
  { id: 'audit_5', caseId: 'case_2', actorId: 'user_3', action: 'Sent secure message to reporter requesting evidence.', timestamp: formatISO(subDays(now, 14)) },
  
  // Case 4
  { id: 'audit_6', caseId: 'case_4', actorId: 'System', action: 'Case automatically created from Email intake.', timestamp: formatISO(subDays(now, 30)) },
  { id: 'audit_7', caseId: 'case_4', actorId: 'user_2', action: 'Assigned user_4 (Financial Auditor) for financial audit support.', timestamp: formatISO(subDays(now, 29)) },
  { id: 'audit_8', caseId: 'case_4', actorId: 'user_4', action: 'Added internal note regarding AP logs.', timestamp: formatISO(subDays(now, 28)) },
  { id: 'audit_9', caseId: 'case_4', actorId: 'user_4', action: 'Added internal note regarding Singapore company registry.', timestamp: formatISO(subDays(now, 20)) },
  { id: 'audit_10', caseId: 'case_4', actorId: 'user_2', action: 'Escalated case status to Under Investigation.', timestamp: formatISO(subDays(now, 19)) },
  
  // Case 7
  { id: 'audit_11', caseId: 'case_7', actorId: 'System', action: 'Case created from Hotline intake.', timestamp: formatISO(subMonths(now, 4.5)) },
  { id: 'audit_12', caseId: 'case_7', actorId: 'user_2', action: 'Status updated to Under Investigation.', timestamp: formatISO(subMonths(now, 4)) },
  { id: 'audit_13', caseId: 'case_7', actorId: 'user_3', action: 'Added environmental audit report as internal note.', timestamp: formatISO(subMonths(now, 3)) },
  { id: 'audit_14', caseId: 'case_7', actorId: 'user_2', action: 'Case resolved and closed. Disciplinary action taken.', timestamp: formatISO(subMonths(now, 2)) },
];
