import { User, Case, Correspondence, InternalNote, Call, AuditLog, ClientOrganization, Evidence } from './types';
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
    status: 'PAR Prepared',
    severity: 'Critical',
    category: 'Financial Misconduct',
    department: 'Finance',
    incidentDate: formatISO(subDays(now, 45)),
    description: 'Discovered severe discrepancies in Q3 vendor payouts. Payments were routed to an unapproved vendor entity in Singapore without standard compliance checks. I have attached the raw ledger exports.',
    source: 'Email',
    reporterEmail: 'audit_alert@tari-ethics.com',
    assigneeIds: ['user_2', 'user_4'],
    par: {
      assessmentDetails: 'Financial audit confirmed three unauthorized wire transfers totaling $450,000 to "Apex Consulting Pte Ltd" (Singapore). The registered director of Apex Consulting shares a residential address with our VP of Sales.',
      evidenceAnalyzed: '1. Q3 AP Ledger Export (ap_ledger_q3_final.csv)\n2. Singapore Company Registry Extract for Apex Consulting\n3. Interview transcript with AP Clerk #4',
      recommendations: '1. Immediate suspension of VP of Sales pending board review.\n2. Invoke clawback clauses on executive compensation.\n3. Self-report FCPA potential violations to external counsel.',
      submittedAt: formatISO(subHours(now, 2))
    },
    createdAt: formatISO(subDays(now, 30)),
    updatedAt: formatISO(subHours(now, 2)),
  },
  {
    id: 'case_2',
    caseNumber: 'TARI-2023-0041',
    organizationId: 'org_1',
    status: 'Under Analysis',
    severity: 'High',
    category: 'Workplace Conduct',
    department: 'Marketing',
    incidentDate: formatISO(subDays(now, 15)),
    description: 'Caller reported ongoing severe harassment by a senior manager during team meetings. Wants to remain completely anonymous out of fear of immediate retaliation.',
    source: 'Hotline',
    assigneeIds: ['user_2', 'user_3'],
    createdAt: formatISO(subDays(now, 15)),
    updatedAt: formatISO(subDays(now, 2)),
  },
  {
    id: 'case_3',
    caseNumber: 'TARI-2023-0020',
    organizationId: 'org_3',
    status: 'Closed',
    severity: 'Critical',
    category: 'Environmental',
    department: 'Manufacturing',
    incidentDate: formatISO(subMonths(now, 5)),
    description: 'Chemical waste (industrial solvent) is being improperly disposed of into the municipal drain near the north factory wall during the night shift to save on hazmat disposal costs.',
    source: 'Email',
    reporterEmail: 'night_shift_anon@gmail.com',
    assigneeIds: ['user_2'],
    par: {
      assessmentDetails: 'Environmental audit confirmed illegal dumping of VOC solvents in the north municipal drain. The shift supervisor ordered the dumping to artificially lower department OPEX.',
      evidenceAnalyzed: '1. Soil sample lab results (Report #ENV-442) showing 400x permitted VOC limits.\n2. Signed confession from shift supervisor obtained during counsel-led interview.',
      recommendations: '1. Terminate shift supervisor.\n2. Self-report to EPA immediately to mitigate fines.\n3. Hire hazardous waste disposal contractor for remediation.',
      submittedAt: formatISO(subMonths(now, 2))
    },
    createdAt: formatISO(subMonths(now, 4.5)),
    updatedAt: formatISO(subMonths(now, 1.5)),
  },
  {
    id: 'case_4',
    caseNumber: 'TARI-2023-0048',
    organizationId: 'org_2',
    status: 'Received',
    severity: 'Low',
    category: 'Physical Security',
    department: 'Facilities',
    description: 'Someone has been leaving the secure server room door propped open after hours on weekends. This is a massive physical security risk for our SOC2 compliance.',
    source: 'Hotline',
    assigneeIds: [],
    createdAt: formatISO(subMinutes(now, 45)),
    updatedAt: formatISO(subMinutes(now, 45)),
  }
];

export const MOCK_CORRESPONDENCE: Correspondence[] = [
  // Case 1 Correspondence (Financial Misconduct)
  { id: 'corr_1', caseId: 'case_1', sender: { name: 'Whistleblower', email: 'audit_alert@tari-ethics.com', isStaff: false }, content: 'Discovered severe discrepancies in Q3 vendor payouts. Payments were routed to an unapproved vendor entity in Singapore without standard compliance checks. I have attached the raw ledger exports.', timestamp: formatISO(subDays(now, 30)) },
  { id: 'corr_2', caseId: 'case_1', sender: { name: 'Financial Auditor', email: 'financial.auditor@tari.co.in', isStaff: true }, content: 'Thank you for your report. We take financial misconduct extremely seriously. Can you provide the specific vendor names or invoice numbers? Your anonymity is strictly protected under our whistleblower policy.', timestamp: formatISO(subDays(now, 29)) },
  { id: 'corr_3', caseId: 'case_1', sender: { name: 'Whistleblower', email: 'audit_alert@tari-ethics.com', isStaff: false }, content: 'The vendor in question is listed as "Apex Consulting Pte Ltd". Total routed was $450,000 across 3 wire transfers. See the attached ledger.', timestamp: formatISO(subDays(now, 28)) },
  { id: 'corr_4', caseId: 'case_1', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: 'Received. We have initiated a formal internal investigation under attorney-client privilege. Please do not discuss this matter with anyone else internally.', timestamp: formatISO(subDays(now, 25)) },
  
  // Case 2 Correspondence (Workplace Conduct)
  { id: 'corr_5', caseId: 'case_2', sender: { name: 'Hotline Transcriber', email: 'system@tari.co.in', isStaff: true }, content: 'Caller stated that the marketing director frequently makes highly inappropriate, discriminatory comments during Monday standups. Caller refused to leave a name.', timestamp: formatISO(subDays(now, 15)) },
  { id: 'corr_6', caseId: 'case_2', sender: { name: 'HR Investigator', email: 'hr.investigator@tari.co.in', isStaff: true }, content: 'We need to speak with you to gather more specifics. We can assure you full anonymity. Could you share a secure way to review the meeting recordings?', timestamp: formatISO(subDays(now, 14)) },
  { id: 'corr_7', caseId: 'case_2', sender: { name: 'Anonymous', email: 'anon123@secure.com', isStaff: false }, content: 'I have uploaded an audio snippet. Please guarantee he won\'t know it came from me. My desk is right next to his.', timestamp: formatISO(subDays(now, 10)) },
  
  // Case 3 Correspondence (Environmental)
  { id: 'corr_8', caseId: 'case_3', sender: { name: 'Whistleblower', email: 'night_shift_anon@gmail.com', isStaff: false }, content: 'Chemical waste (industrial solvent) is being improperly disposed of into the municipal drain near the north factory wall during the night shift.', timestamp: formatISO(subMonths(now, 4.5)) },
  { id: 'corr_9', caseId: 'case_3', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: 'This is a severe regulatory risk. Can you specify which bay and who gave the direct order?', timestamp: formatISO(subDays(subMonths(now, 4.5), -1)) },
  { id: 'corr_10', caseId: 'case_3', sender: { name: 'Whistleblower', email: 'night_shift_anon@gmail.com', isStaff: false }, content: 'Bay 4. The shift supervisor, Mark, explicitly said the hazmat barrels were destroying his quarterly budget. He ordered us to flush it.', timestamp: formatISO(subDays(subMonths(now, 4.5), -5)) }
];

export const MOCK_EVIDENCE: Evidence[] = [
  { id: 'ev_1', caseId: 'case_1', filename: 'ap_ledger_q3_final.csv', fileSize: '4.2 MB', uploadedBy: 'Reporter', timestamp: formatISO(subDays(now, 28)), description: 'Raw AP export highlighting the 3 wire transfers to Apex Consulting.' },
  { id: 'ev_2', caseId: 'case_1', filename: 'sg_registry_extract.pdf', fileSize: '1.1 MB', uploadedBy: 'user_4', timestamp: formatISO(subDays(now, 20)), description: 'ACRA corporate registry extract for Apex Consulting Pte Ltd.' },
  { id: 'ev_3', caseId: 'case_2', filename: 'meeting_audio_snippet.m4a', fileSize: '3.5 MB', uploadedBy: 'Reporter', timestamp: formatISO(subDays(now, 10)), description: 'Audio recording from the Monday standup.' },
  { id: 'ev_4', caseId: 'case_3', filename: 'soil_lab_report_ENV442.pdf', fileSize: '2.8 MB', uploadedBy: 'user_2', timestamp: formatISO(subMonths(now, 3)), description: 'Independent environmental lab test results for soil near north drain.' }
];

export const MOCK_INTERNAL_NOTES: InternalNote[] = [
  // Case 1 Notes
  { id: 'note_1', caseId: 'case_1', senderId: 'user_4', content: 'I have pulled the AP logs for Q3 directly from SAP. The $450k transfers to Singapore bypassed standard approval routing.', timestamp: formatISO(subDays(now, 28)) },
  { id: 'note_2', caseId: 'case_1', senderId: 'user_2', content: 'LEGAL HOLD: I have instructed IT to issue a formal spoliation hold on all emails and Slack messages for the VP of Sales and the AP department.', timestamp: formatISO(subDays(now, 27)) },
  { id: 'note_3', caseId: 'case_1', senderId: 'user_4', content: 'I checked the company registry in Singapore. The company was incorporated only 4 months ago, and the registered director shares a last name and residential address with our VP of Sales.', timestamp: formatISO(subDays(now, 20)) },
  { id: 'note_4', caseId: 'case_1', senderId: 'user_2', content: 'This is a severe conflict of interest and potential fraud. Escalating to the Audit Committee of the Board of Directors immediately.', timestamp: formatISO(subDays(now, 19)) },
  
  // Case 2 Notes
  { id: 'note_5', caseId: 'case_2', senderId: 'user_2', content: 'Assigned HR Investigator to assist. We must strictly ring-fence this reporter\'s identity. The marketing director has a history of retaliation.', timestamp: formatISO(subDays(now, 14)) },
  { id: 'note_6', caseId: 'case_2', senderId: 'user_3', content: 'Reviewed the audio snippet. The comments are explicitly discriminatory. Recommending external counsel handle the direct interview to maintain privilege.', timestamp: formatISO(subDays(now, 9)) },
  
  // Case 3 Notes
  { id: 'note_7', caseId: 'case_3', senderId: 'user_2', content: 'Dispatched external environmental consultants (Golder Associates) to sample the soil near Bay 4 under attorney-client privilege.', timestamp: formatISO(subDays(subMonths(now, 4.5), -7)) },
  { id: 'note_8', caseId: 'case_3', senderId: 'user_2', content: 'Lab results confirm extreme VOC contamination. We have a strict duty to self-report to the EPA within 72 hours.', timestamp: formatISO(subMonths(now, 3)) }
];

export const MOCK_CALLS: Call[] = [
  { id: 'call_1', callSid: 'CA1234567890abcdef1234567890abcdef', durationSeconds: 145, timestamp: formatISO(subDays(now, 15)), status: 'Voicemail', caseId: 'case_2' },
  { id: 'call_2', callSid: 'CA0987654321fedcba0987654321fedcba', durationSeconds: 42, timestamp: formatISO(subMinutes(now, 45)), status: 'Voicemail', caseId: 'case_4' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  // Case 1 (Financial)
  { id: 'audit_1', caseId: 'case_1', actorId: 'System', action: 'Case automatically created from Email intake.', timestamp: formatISO(subDays(now, 30)) },
  { id: 'audit_2', caseId: 'case_1', actorId: 'user_2', action: 'Acknowledged to the complainant and company is informed about the complaint (identity withheld).', timestamp: formatISO(subDays(now, 29)) },
  { id: 'audit_3', caseId: 'case_1', actorId: 'System', action: 'Evidence file uploaded: ap_ledger_q3_final.csv (Chain of Custody logged)', timestamp: formatISO(subDays(now, 28)) },
  { id: 'audit_4', caseId: 'case_1', actorId: 'user_4', action: 'Conversation with the complainant is commenced and additional information and evidence is sought.', timestamp: formatISO(subDays(now, 28)) },
  { id: 'audit_5', caseId: 'case_1', actorId: 'user_2', action: 'Legal/Spoliation hold issued to IT department.', timestamp: formatISO(subDays(now, 27)) },
  { id: 'audit_6', caseId: 'case_1', actorId: 'user_4', action: 'Evidence file uploaded: sg_registry_extract.pdf', timestamp: formatISO(subDays(now, 20)) },
  { id: 'audit_7', caseId: 'case_1', actorId: 'user_2', action: 'Complaint and evidence is analyzed.', timestamp: formatISO(subDays(now, 19)) },
  { id: 'audit_8', caseId: 'case_1', actorId: 'user_2', action: 'Preliminary assessment report (PAR) is prepared with recommendations on how to address the complaint and shared with the company.', timestamp: formatISO(subHours(now, 2)) },
  
  // Case 2 (Workplace Conduct)
  { id: 'audit_9', caseId: 'case_2', actorId: 'System', action: 'Case created from Hotline intake. Call SID: CA123...', timestamp: formatISO(subDays(now, 15)) },
  { id: 'audit_10', caseId: 'case_2', actorId: 'user_2', action: 'Acknowledged to the complainant and company is informed about the complaint (identity withheld).', timestamp: formatISO(subDays(now, 14)) },
  { id: 'audit_11', caseId: 'case_2', actorId: 'user_3', action: 'Conversation with the complainant is commenced and additional information and evidence is sought.', timestamp: formatISO(subDays(now, 14)) },
  { id: 'audit_12', caseId: 'case_2', actorId: 'System', action: 'Evidence file uploaded: meeting_audio_snippet.m4a', timestamp: formatISO(subDays(now, 10)) },
  { id: 'audit_13', caseId: 'case_2', actorId: 'user_2', action: 'Complaint and evidence is analyzed.', timestamp: formatISO(subDays(now, 2)) },
  
  // Case 3 (Environmental)
  { id: 'audit_14', caseId: 'case_3', actorId: 'System', action: 'Case automatically created from Email intake.', timestamp: formatISO(subMonths(now, 4.5)) },
  { id: 'audit_15', caseId: 'case_3', actorId: 'user_2', action: 'Acknowledged to the complainant and company is informed about the complaint (identity withheld).', timestamp: formatISO(subDays(subMonths(now, 4.5), -1)) },
  { id: 'audit_16', caseId: 'case_3', actorId: 'user_2', action: 'Conversation with the complainant is commenced and additional information and evidence is sought.', timestamp: formatISO(subDays(subMonths(now, 4.5), -2)) },
  { id: 'audit_17', caseId: 'case_3', actorId: 'System', action: 'Evidence file uploaded: soil_lab_report_ENV442.pdf (Chain of Custody logged)', timestamp: formatISO(subMonths(now, 3)) },
  { id: 'audit_18', caseId: 'case_3', actorId: 'user_2', action: 'Complaint and evidence is analyzed.', timestamp: formatISO(subDays(subMonths(now, 3), -1)) },
  { id: 'audit_19', caseId: 'case_3', actorId: 'user_2', action: 'Preliminary assessment report (PAR) is prepared with recommendations on how to address the complaint and shared with the company.', timestamp: formatISO(subMonths(now, 2)) },
  { id: 'audit_20', caseId: 'case_3', actorId: 'user_2', action: 'Complaint is closed from TAC after submission of PAR.', timestamp: formatISO(subMonths(now, 1.5)) },
  
  // Case 4 (Physical Security)
  { id: 'audit_21', caseId: 'case_4', actorId: 'System', action: 'Case created from Hotline intake.', timestamp: formatISO(subMinutes(now, 45)) },
];
