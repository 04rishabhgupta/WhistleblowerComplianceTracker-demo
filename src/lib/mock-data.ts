import { User, Case, Correspondence, InternalNote, Call, AuditLog, ClientOrganization, Evidence } from './types';
import { subMonths, subDays, subHours, subMinutes, formatISO } from 'date-fns';

const now = new Date();

export const MOCK_USERS: User[] = [
  { id: 'user_1', name: 'Platform Admin', email: 'sys-admin@tari.co.in', role: 'SysAdmin', department: 'Platform Admin', avatar: 'PA' },
  { id: 'user_2', name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', role: 'Investigator', department: 'Legal & Compliance', avatar: 'LI' },
  { id: 'user_3', name: 'HR Investigator', email: 'hr.investigator@tari.co.in', role: 'Investigator', department: 'HR Compliance', avatar: 'HI' },
  { id: 'user_4', name: 'Financial Auditor', email: 'financial.auditor@tari.co.in', role: 'Investigator', department: 'Financial Audit', avatar: 'FA' }
];

export const MOCK_ORGANIZATIONS: ClientOrganization[] = [
  { id: 'org_1', name: 'Acme Corp', intakeEmail: 'acmecorp@tari.co.in' },
  { id: 'org_2', name: 'Globex Inc', intakeEmail: 'globex@tari.co.in' },
  { id: 'org_3', name: 'Stark Industries', intakeEmail: 'stark@tari.co.in' },
];

export const MOCK_CASES: Case[] = [
  // ===================== ACME CORP =====================
  {
    id: 'case_a1', caseNumber: 'TARI-ACME-001', organizationId: 'org_1', status: 'Closed', severity: 'Critical',
    category: 'Financial Misconduct', department: 'Procurement', incidentDate: formatISO(subDays(now, 60)),
    description: "Procurement Director has been systematically demanding 5% kickbacks from IT vendors in exchange for guaranteed contract renewals. I have attached the ledger anomalies and a recorded conversation.",
    source: 'Email', reporterEmail: 'vendor_anon99@protonmail.com', assigneeIds: ['user_2', 'user_4'],
    par: {
      assessmentDetails: "Forensic audit of procurement ledgers confirmed systematic overpayment of 5% above market rate to 3 IT vendors. Email metadata confirms the Director routed payments to offshore shell accounts.",
      evidenceAnalyzed: "1. IT Vendor Contract Renewals (FY22-23)\n2. Offshore Wire Transfer Swift Codes (Cayman)\n3. Recorded voicemail from vendor.",
      recommendations: "1. Immediate termination of Procurement Director with cause.\n2. Initiate civil litigation to recover $1.2M in stolen funds.\n3. Report to Department of Justice (FCPA violations).",
      submittedAt: formatISO(subDays(now, 5))
    },
    createdAt: formatISO(subDays(now, 45)), updatedAt: formatISO(subDays(now, 2)),
  },
  {
    id: 'case_a2', caseNumber: 'TARI-ACME-002', organizationId: 'org_1', status: 'Under Analysis', severity: 'High',
    category: 'Workplace Conduct', department: 'Sales', incidentDate: formatISO(subDays(now, 16)),
    description: "The VP of Sales has been making highly discriminatory remarks about female employees during Q3 pipeline reviews. He also retaliated against a female AE by removing her from the biggest account.",
    source: 'Hotline', reporterPhone: '+1-555-0192', assigneeIds: ['user_2', 'user_3'],
    createdAt: formatISO(subDays(now, 15)), updatedAt: formatISO(subDays(now, 2)),
  },

  // ===================== GLOBEX INC =====================
  {
    id: 'case_g1', caseNumber: 'TARI-GLOB-001', organizationId: 'org_2', status: 'Closed', severity: 'Critical',
    category: 'Environmental', department: 'Manufacturing', incidentDate: formatISO(subDays(now, 100)),
    description: "Factory Manager is ordering the night shift to bypass the wastewater filtration system to save on electricity costs. Highly toxic heavy metals are being pumped directly into the municipal water supply.",
    source: 'Hotline', reporterPhone: 'Anonymous', assigneeIds: ['user_2'],
    par: {
      assessmentDetails: "Independent lab tests (Golder Associates) confirmed lead and cadmium levels 800% above EPA limits at the factory outflow pipe during night shifts.",
      evidenceAnalyzed: "1. Lab Test Report #ENV-992.\n2. Factory SCADA system bypass logs (showing filtration disabled between 1AM-5AM).",
      recommendations: "1. Immediate termination of Factory Manager.\n2. 72-hour mandatory self-disclosure to the EPA.\n3. Retain crisis PR firm and external remediation contractors.",
      submittedAt: formatISO(subDays(now, 15))
    },
    createdAt: formatISO(subDays(now, 90)), updatedAt: formatISO(subDays(now, 10)),
  },
  {
    id: 'case_g2', caseNumber: 'TARI-GLOB-002', organizationId: 'org_2', status: 'Under Analysis', severity: 'High',
    category: 'Data Privacy', department: 'Engineering', incidentDate: formatISO(subDays(now, 6)),
    description: "A massive AWS S3 bucket containing 10,000 unencrypted European customer passports (KYC data) was left completely public for 3 weeks. A developer found it but management told him to \"keep quiet\".",
    source: 'Email', reporterEmail: 'devops_whistleblower@globex.internal', assigneeIds: ['user_2', 'user_4'],
    createdAt: formatISO(subDays(now, 5)), updatedAt: formatISO(subDays(now, 1)),
  },

  // ===================== STARK INDUSTRIES =====================
  {
    id: 'case_s1', caseNumber: 'TARI-STAR-001', organizationId: 'org_3', status: 'Closed', severity: 'Critical',
    category: 'IP Theft', department: 'R&D', incidentDate: formatISO(subDays(now, 65)),
    description: "Senior lead engineer on the Mark VII project has been caught transferring terabytes of proprietary schematics to an unauthorized external hard drive right before his resignation to join a rival firm.",
    source: 'Email', reporterEmail: 'sec_ops_alert@stark.com', assigneeIds: ['user_2', 'user_4'],
    par: {
      assessmentDetails: "DLP (Data Loss Prevention) software logs conclusively prove the exfiltration of 2.1 TB of CAD schematics and source code via a Kingston USB drive.",
      evidenceAnalyzed: "1. CrowdStrike Falcon DLP Logs.\n2. CCTV footage of engineer accessing secure terminal at 3:00 AM.",
      recommendations: "1. Immediate injunction and restraining order against the ex-employee.\n2. Criminal referral to the FBI for corporate espionage.\n3. Revoke all facility physical access instantly.",
      submittedAt: formatISO(subDays(now, 10))
    },
    createdAt: formatISO(subDays(now, 60)), updatedAt: formatISO(subDays(now, 5)),
  },
  {
    id: 'case_s2', caseNumber: 'TARI-STAR-002', organizationId: 'org_3', status: 'Under Analysis', severity: 'Medium',
    category: 'Conflict of Interest', department: 'Operations', incidentDate: formatISO(subDays(now, 25)),
    description: "The Operations Director awarded a $5M catering and events contract to \"Gourmet Galore\", a company entirely owned by his wife, without disclosing the conflict of interest or running a competitive RFP.",
    source: 'Hotline', reporterPhone: '+1-555-8832', assigneeIds: ['user_2', 'user_4'],
    createdAt: formatISO(subDays(now, 20)), updatedAt: formatISO(subDays(now, 5)),
  }
];

export const MOCK_CORRESPONDENCE: Correspondence[] = [
  // --- A1 Correspondences ---
  { id: 'corr_a1_1', caseId: 'case_a1', sender: { name: 'Reporter', email: 'vendor_anon99@protonmail.com', isStaff: false }, content: "Procurement Director has been systematically demanding 5% kickbacks from IT vendors in exchange for guaranteed contract renewals. I have attached the ledger anomalies and a recorded conversation.", timestamp: formatISO(subDays(now, 45)) },
  { id: 'corr_a1_2', caseId: 'case_a1', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: "We take these allegations extremely seriously. We have invoked a legal hold to preserve all evidence. Can you securely provide the offshore account routing details?", timestamp: formatISO(subDays(now, 43)) },
  { id: 'corr_a1_3', caseId: 'case_a1', sender: { name: 'Reporter', email: 'vendor_anon99@protonmail.com', isStaff: false }, content: "Attached the offshore swift codes. The bank is in the Cayman Islands. They are routing it through a shell company called 'Apex Consulting'.", timestamp: formatISO(subDays(now, 40)) },
  { id: 'corr_a1_4', caseId: 'case_a1', sender: { name: 'Financial Auditor', email: 'financial.auditor@tari.co.in', isStaff: true }, content: "Received. Our forensic accounting team is mapping the SWIFT routes against our ERP ledgers. Please do not discuss this with anyone.", timestamp: formatISO(subDays(now, 38)) },
  { id: 'corr_a1_5', caseId: 'case_a1', sender: { name: 'Reporter', email: 'vendor_anon99@protonmail.com', isStaff: false }, content: "Understood. I will lay low. The director is asking for another meeting next week. Should I record it?", timestamp: formatISO(subDays(now, 35)) },
  { id: 'corr_a1_6', caseId: 'case_a1', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: "Under advice of counsel, please DO NOT actively record further conversations, as this may violate state two-party consent laws. We have enough evidence to proceed internally.", timestamp: formatISO(subDays(now, 34)) },

  // --- A2 Correspondences ---
  { id: 'corr_a2_1', caseId: 'case_a2', sender: { name: 'Hotline Operator', email: 'system@tari.co.in', isStaff: true }, content: "Caller reported that the VP of Sales has been making highly discriminatory remarks about female employees during Q3 pipeline reviews. He also retaliated against a female AE by removing her from the biggest account. Caller hung up before providing name.", timestamp: formatISO(subDays(now, 15)) },
  { id: 'corr_a2_2', caseId: 'case_a2', sender: { name: 'HR Investigator', email: 'hr.investigator@tari.co.in', isStaff: true }, content: "We need to establish communication. If you are checking this portal, please know your identity is fully protected. Can you provide the date of the Q3 pipeline review?", timestamp: formatISO(subDays(now, 13)) },
  { id: 'corr_a2_3', caseId: 'case_a2', sender: { name: 'Reporter', email: 'anon', isStaff: false }, content: "The meeting was on the 14th. There is a Zoom cloud recording. You can check the transcript at minute 42. He explicitly said women lack the killer instinct for enterprise sales.", timestamp: formatISO(subDays(now, 10)) },

  // --- G1 Correspondences ---
  { id: 'corr_g1_1', caseId: 'case_g1', sender: { name: 'Reporter', email: 'anon', isStaff: false }, content: "Factory Manager is ordering the night shift to bypass the wastewater filtration system to save on electricity costs. Highly toxic heavy metals are being pumped directly into the municipal water supply.", timestamp: formatISO(subDays(now, 90)) },
  { id: 'corr_g1_2', caseId: 'case_g1', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: "This is a catastrophic environmental and legal risk. We are dispatching an independent testing firm to the site tonight. Do not alert the manager.", timestamp: formatISO(subDays(now, 85)) },
  { id: 'corr_g1_3', caseId: 'case_g1', sender: { name: 'Reporter', email: 'anon', isStaff: false }, content: "I have secured the SCADA logs from the terminal showing the filtration unit was manually overridden. Uploading now.", timestamp: formatISO(subDays(now, 80)) },
  { id: 'corr_g1_4', caseId: 'case_g1', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: "Received SCADA logs. The independent lab also confirmed massive lead spikes. We are moving to secure the facility and self-report to the EPA.", timestamp: formatISO(subDays(now, 60)) },
  { id: 'corr_g1_5', caseId: 'case_g1', sender: { name: 'Reporter', email: 'anon', isStaff: false }, content: "Thank you. I was terrified of being fired but I could not let them poison the river.", timestamp: formatISO(subDays(now, 58)) },

  // --- G2 Correspondences ---
  { id: 'corr_g2_1', caseId: 'case_g2', sender: { name: 'Reporter', email: 'devops_whistleblower@globex.internal', isStaff: false }, content: "A massive AWS S3 bucket containing 10,000 unencrypted European customer passports (KYC data) was left completely public for 3 weeks. A developer found it but management told him to 'keep quiet'.", timestamp: formatISO(subDays(now, 5)) },
  { id: 'corr_g2_2', caseId: 'case_g2', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: "This triggers mandatory 72-hour GDPR breach notification laws. Provide the S3 bucket ARN immediately so we can lock it down.", timestamp: formatISO(subDays(now, 4.9)) },
  { id: 'corr_g2_3', caseId: 'case_g2', sender: { name: 'Reporter', email: 'devops_whistleblower@globex.internal', isStaff: false }, content: "Bucket ARN is arn:aws:s3:::globex-prod-kyc-backups-eu. I have attached the CloudTrail logs proving it was publicly accessible.", timestamp: formatISO(subDays(now, 4.8)) },
  { id: 'corr_g2_4', caseId: 'case_g2', sender: { name: 'Financial Auditor', email: 'financial.auditor@tari.co.in', isStaff: true }, content: "Our security team has revoked public access and secured the bucket. We are initiating forensics to determine if any external IPs downloaded the passports.", timestamp: formatISO(subDays(now, 4.5)) },

  // --- S1 Correspondences ---
  { id: 'corr_s1_1', caseId: 'case_s1', sender: { name: 'Reporter', email: 'sec_ops_alert@stark.com', isStaff: false }, content: "Senior lead engineer on the Mark VII project has been caught transferring terabytes of proprietary schematics to an unauthorized external hard drive right before his resignation to join a rival firm.", timestamp: formatISO(subDays(now, 60)) },
  { id: 'corr_s1_2', caseId: 'case_s1', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: "Has the engineer left the building? Has the external drive been secured?", timestamp: formatISO(subDays(now, 55)) },
  { id: 'corr_s1_3', caseId: 'case_s1', sender: { name: 'Reporter', email: 'sec_ops_alert@stark.com', isStaff: false }, content: "He is still in the building. Security has not confronted him yet. The drive is in his backpack.", timestamp: formatISO(subDays(now, 54)) },
  { id: 'corr_s1_4', caseId: 'case_s1', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: "DO NOT let him leave with the drive. Dispatch physical security to detain him in conference room 3. Our external counsel is drafting an immediate injunction.", timestamp: formatISO(subDays(now, 54)) },
  { id: 'corr_s1_5', caseId: 'case_s1', sender: { name: 'Reporter', email: 'sec_ops_alert@stark.com', isStaff: false }, content: "Security detained him. We confiscated the Kingston USB drive. Chain of custody form signed. Uploading the DLP forensic logs now.", timestamp: formatISO(subDays(now, 53)) },
  { id: 'corr_s1_6', caseId: 'case_s1', sender: { name: 'Lead Investigator', email: 'lead.investigator@tari.co.in', isStaff: true }, content: "Excellent work. Secure his laptop in a Faraday bag to prevent remote wipes. Legal is taking over.", timestamp: formatISO(subDays(now, 50)) },
  { id: 'corr_s1_7', caseId: 'case_s1', sender: { name: 'Reporter', email: 'sec_ops_alert@stark.com', isStaff: false }, content: "Understood. Laptop secured in Faraday bag and locked in the Evidence safe.", timestamp: formatISO(subDays(now, 49)) },

  // --- S2 Correspondences ---
  { id: 'corr_s2_1', caseId: 'case_s2', sender: { name: 'Reporter', email: 'anon', isStaff: false }, content: "The Operations Director awarded a $5M catering and events contract to 'Gourmet Galore', a company entirely owned by his wife, without disclosing the conflict of interest or running a competitive RFP.", timestamp: formatISO(subDays(now, 20)) },
  { id: 'corr_s2_2', caseId: 'case_s2', sender: { name: 'Financial Auditor', email: 'financial.auditor@tari.co.in', isStaff: true }, content: "Thank you for this report. Can you provide the specific contract ID or date of signing?", timestamp: formatISO(subDays(now, 18)) },
  { id: 'corr_s2_3', caseId: 'case_s2', sender: { name: 'Reporter', email: 'anon', isStaff: false }, content: "Contract ID is #CTR-2023-882. Signed on October 12th. I have attached the State business registry proving his wife is the sole proprietor of Gourmet Galore.", timestamp: formatISO(subDays(now, 15)) },
];

export const MOCK_EVIDENCE: Evidence[] = [
  // A1
  { id: 'ev_a1_1', caseId: 'case_a1', filename: 'offshore_swift_codes.pdf', fileSize: '1.2 MB', uploadedBy: 'Reporter', timestamp: formatISO(subDays(now, 40)), description: "Bank SWIFT routing codes tracing funds to Cayman shell company." },
  { id: 'ev_a1_2', caseId: 'case_a1', filename: 'erp_ledger_export_Q3.csv', fileSize: '4.8 MB', uploadedBy: 'user_4', timestamp: formatISO(subDays(now, 37)), description: "SAP ERP raw ledger export showing 5% markups on 3 IT vendor contracts." },
  { id: 'ev_a1_3', caseId: 'case_a1', filename: 'vendor_voicemail_recording.mp3', fileSize: '3.1 MB', uploadedBy: 'Reporter', timestamp: formatISO(subDays(now, 45)), description: "Initial recording provided by whistleblower." },
  // A2
  { id: 'ev_a2_1', caseId: 'case_a2', filename: 'zoom_transcript_Q3_pipeline.pdf', fileSize: '450 KB', uploadedBy: 'user_3', timestamp: formatISO(subDays(now, 9)), description: "Official Zoom transcript of the Q3 pipeline review highlighting minute 42." },
  { id: 'ev_a2_2', caseId: 'case_a2', filename: 'account_reassignment_log.csv', fileSize: '120 KB', uploadedBy: 'user_3', timestamp: formatISO(subDays(now, 8)), description: "Salesforce audit log proving the female AE was removed from the enterprise account." },
  // G1
  { id: 'ev_g1_1', caseId: 'case_g1', filename: 'scada_terminal_logs.xml', fileSize: '8.4 MB', uploadedBy: 'Reporter', timestamp: formatISO(subDays(now, 80)), description: "Raw factory ICS logs showing manual override of wastewater filtration." },
  { id: 'ev_g1_2', caseId: 'case_g1', filename: 'golder_associates_lab_results.pdf', fileSize: '2.3 MB', uploadedBy: 'user_2', timestamp: formatISO(subDays(now, 75)), description: "Independent lab results confirming 800% lead toxicity in effluent." },
  { id: 'ev_g1_3', caseId: 'case_g1', filename: 'factory_manager_confession.pdf', fileSize: '1.1 MB', uploadedBy: 'user_2', timestamp: formatISO(subDays(now, 60)), description: "Signed affidavit from factory manager obtained during counsel interview." },
  // G2
  { id: 'ev_g2_1', caseId: 'case_g2', filename: 'aws_cloudtrail_s3_access.json', fileSize: '12.5 MB', uploadedBy: 'Reporter', timestamp: formatISO(subDays(now, 4.8)), description: "CloudTrail logs proving the S3 bucket policy was altered to PublicRead." },
  { id: 'ev_g2_2', caseId: 'case_g2', filename: 'kyc_passport_sample.png', fileSize: '2.1 MB', uploadedBy: 'Reporter', timestamp: formatISO(subDays(now, 4.8)), description: "Redacted screenshot proving PII was exposed." },
  // S1
  { id: 'ev_s1_1', caseId: 'case_s1', filename: 'crowdstrike_dlp_alert.pdf', fileSize: '3.4 MB', uploadedBy: 'Reporter', timestamp: formatISO(subDays(now, 53)), description: "Endpoint DLP logs showing 2.1TB file transfer to Kingston USB." },
  { id: 'ev_s1_2', caseId: 'case_s1', filename: 'chain_of_custody_usb.pdf', fileSize: '800 KB', uploadedBy: 'Reporter', timestamp: formatISO(subDays(now, 53)), description: "Signed chain of custody form for the confiscated external hard drive." },
  { id: 'ev_s1_3', caseId: 'case_s1', filename: 'cctv_server_room.mp4', fileSize: '145 MB', uploadedBy: 'user_2', timestamp: formatISO(subDays(now, 50)), description: "CCTV footage of engineer in server room at 3:00 AM." },
  // S2
  { id: 'ev_s2_1', caseId: 'case_s2', filename: 'state_biz_registry_gourmet_galore.pdf', fileSize: '1.5 MB', uploadedBy: 'Reporter', timestamp: formatISO(subDays(now, 15)), description: "State business registry extract showing Director's wife as sole proprietor." },
];

export const MOCK_INTERNAL_NOTES: InternalNote[] = [
  // A1
  { id: 'note_a1_1', caseId: 'case_a1', senderId: 'user_2', content: "LEGAL HOLD ISSUED: I have instructed IT to place a comprehensive litigation spoliation hold on all emails, Slack messages, and ERP logs for the Procurement Director.", timestamp: formatISO(subDays(now, 44)) },
  { id: 'note_a1_2', caseId: 'case_a1', senderId: 'user_4', content: "Forensic accounting confirms the kickback structure. The invoices were inflated exactly 5% over MSRP, and the delta was wired to the Cayman shell company.", timestamp: formatISO(subDays(now, 37)) },
  { id: 'note_a1_3', caseId: 'case_a1', senderId: 'user_2', content: "PRIVILEGED: External counsel (Baker McKenzie) has been retained. They will conduct the formal interview with the Director tomorrow under Upjohn warnings.", timestamp: formatISO(subDays(now, 25)) },
  { id: 'note_a1_4', caseId: 'case_a1', senderId: 'user_2', content: "Director confessed during interview. Drafting PAR and preparing DOJ disclosure for FCPA violations.", timestamp: formatISO(subDays(now, 6)) },
  
  // A2
  { id: 'note_a2_1', caseId: 'case_a2', senderId: 'user_2', content: "HR, please pull the Zoom cloud recordings for the Q3 pipeline review and the Salesforce account assignment logs for the retaliated AE.", timestamp: formatISO(subDays(now, 14)) },
  { id: 'note_a2_2', caseId: 'case_a2', senderId: 'user_3', content: "Logs pulled. The retaliation is obvious in the audit trail. The AE was removed from the account 12 hours after she complained to her manager about the remarks.", timestamp: formatISO(subDays(now, 8)) },

  // G1
  { id: 'note_g1_1', caseId: 'case_g1', senderId: 'user_2', content: "PRIVILEGED: Retained environmental counsel. They are dispatching Golder Associates to conduct water sampling under strict attorney-client privilege to protect the findings from immediate FOIA.", timestamp: formatISO(subDays(now, 88)) },
  { id: 'note_g1_2', caseId: 'case_g1', senderId: 'user_2', content: "Lab results are catastrophic. Privilege no longer shields this as there is an imminent threat to public health. We must invoke the emergency self-disclosure protocol with the EPA.", timestamp: formatISO(subDays(now, 74)) },
  
  // G2
  { id: 'note_g2_1', caseId: 'case_g2', senderId: 'user_2', content: "INCIDENT RESPONSE DECLARED. P1 severity. We have 72 hours to notify the ICO under GDPR Article 33. I am looping in the CISO.", timestamp: formatISO(subDays(now, 4.9)) },
  { id: 'note_g2_2', caseId: 'case_g2', senderId: 'user_4', content: "CISO confirms the bucket is locked down. AWS Support is running forensic queries to see if any external IP actually downloaded the objects.", timestamp: formatISO(subDays(now, 4.5)) },
  { id: 'note_g2_3', caseId: 'case_g2', senderId: 'user_2', content: "AWS logs confirm 4 objects were accessed by a Russian IP. This is a confirmed breach. Drafting notifications to affected data subjects.", timestamp: formatISO(subDays(now, 2)) },

  // S1
  { id: 'note_s1_1', caseId: 'case_s1', senderId: 'user_2', content: "CRITICAL: IP Theft in progress. I am coordinating with Physical Security to intercept the engineer at the lobby exits.", timestamp: formatISO(subDays(now, 55)) },
  { id: 'note_s1_2', caseId: 'case_s1', senderId: 'user_4', content: "We have secured the laptop and the USB drive. They are locked in the Faraday safe in the legal department. Initiating bit-for-bit forensic imaging of both drives.", timestamp: formatISO(subDays(now, 49)) },
  { id: 'note_s1_3', caseId: 'case_s1', senderId: 'user_2', content: "Forensic imaging complete. The USB drive contains the entire source code for the Mark VII propulsion system. Drafting FBI referral.", timestamp: formatISO(subDays(now, 30)) },

  // S2
  { id: 'note_s2_1', caseId: 'case_s2', senderId: 'user_4', content: "I have pulled the AP vendor master file. 'Gourmet Galore' was fast-tracked past procurement controls by the Operations Director's direct override.", timestamp: formatISO(subDays(now, 17)) },
];

export const MOCK_CALLS: Call[] = [
  { id: 'call_1', callSid: 'CA1234567890abcdef1234567890abc_A2', durationSeconds: 145, timestamp: formatISO(subDays(now, 15)), status: 'Voicemail', caseId: 'case_a2' },
  { id: 'call_2', callSid: 'CA0987654321fedcba0987654321fed_G1', durationSeconds: 320, timestamp: formatISO(subDays(now, 90)), status: 'Answered', caseId: 'case_g1' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  // --- Case A1 Audit Logs ---
  { id: 'al_a1_1', caseId: 'case_a1', actorId: 'System', action: 'Case automatically created from Email intake.', timestamp: formatISO(subDays(now, 45)) },
  { id: 'al_a1_2', caseId: 'case_a1', actorId: 'user_2', action: 'Acknowledged to the complainant and company is informed about the complaint (identity withheld).', timestamp: formatISO(subDays(now, 44)) },
  { id: 'al_a1_3', caseId: 'case_a1', actorId: 'user_2', action: 'Legal/Spoliation hold issued to IT department.', timestamp: formatISO(subDays(now, 44)) },
  { id: 'al_a1_4', caseId: 'case_a1', actorId: 'user_2', action: 'Conversation with the complainant is commenced and additional information and evidence is sought.', timestamp: formatISO(subDays(now, 43)) },
  { id: 'al_a1_5', caseId: 'case_a1', actorId: 'System', action: 'Evidence file uploaded: offshore_swift_codes.pdf (Chain of Custody logged)', timestamp: formatISO(subDays(now, 40)) },
  { id: 'al_a1_6', caseId: 'case_a1', actorId: 'System', action: 'Evidence file uploaded: erp_ledger_export_Q3.csv (Chain of Custody logged)', timestamp: formatISO(subDays(now, 37)) },
  { id: 'al_a1_7', caseId: 'case_a1', actorId: 'user_2', action: 'Complaint and evidence is analyzed.', timestamp: formatISO(subDays(now, 20)) },
  { id: 'al_a1_8', caseId: 'case_a1', actorId: 'user_2', action: 'Preliminary assessment report (PAR) is prepared with recommendations on how to address the complaint and shared with the company.', timestamp: formatISO(subDays(now, 5)) },
  { id: 'al_a1_9', caseId: 'case_a1', actorId: 'user_2', action: 'Complaint is closed from TAC after submission of PAR.', timestamp: formatISO(subDays(now, 2)) },

  // --- Case A2 Audit Logs ---
  { id: 'al_a2_1', caseId: 'case_a2', actorId: 'System', action: 'Case created from Hotline intake. Call SID: CA123...', timestamp: formatISO(subDays(now, 15)) },
  { id: 'al_a2_2', caseId: 'case_a2', actorId: 'user_2', action: 'Acknowledged to the complainant and company is informed about the complaint (identity withheld).', timestamp: formatISO(subDays(now, 14)) },
  { id: 'al_a2_3', caseId: 'case_a2', actorId: 'user_3', action: 'Conversation with the complainant is commenced and additional information and evidence is sought.', timestamp: formatISO(subDays(now, 13)) },
  { id: 'al_a2_4', caseId: 'case_a2', actorId: 'System', action: 'Evidence file uploaded: zoom_transcript_Q3_pipeline.pdf', timestamp: formatISO(subDays(now, 9)) },
  { id: 'al_a2_5', caseId: 'case_a2', actorId: 'user_3', action: 'Evidence file uploaded: account_reassignment_log.csv', timestamp: formatISO(subDays(now, 8)) },
  { id: 'al_a2_6', caseId: 'case_a2', actorId: 'user_2', action: 'Complaint and evidence is analyzed.', timestamp: formatISO(subDays(now, 2)) },

  // --- Case G1 Audit Logs ---
  { id: 'al_g1_1', caseId: 'case_g1', actorId: 'System', action: 'Case automatically created from Hotline intake.', timestamp: formatISO(subDays(now, 90)) },
  { id: 'al_g1_2', caseId: 'case_g1', actorId: 'user_2', action: 'Acknowledged to the complainant and company is informed about the complaint (identity withheld).', timestamp: formatISO(subDays(now, 89)) },
  { id: 'al_g1_3', caseId: 'case_g1', actorId: 'user_2', action: 'Conversation with the complainant is commenced and additional information and evidence is sought.', timestamp: formatISO(subDays(now, 85)) },
  { id: 'al_g1_4', caseId: 'case_g1', actorId: 'System', action: 'Evidence file uploaded: scada_terminal_logs.xml', timestamp: formatISO(subDays(now, 80)) },
  { id: 'al_g1_5', caseId: 'case_g1', actorId: 'System', action: 'Evidence file uploaded: golder_associates_lab_results.pdf', timestamp: formatISO(subDays(now, 75)) },
  { id: 'al_g1_6', caseId: 'case_g1', actorId: 'System', action: 'Evidence file uploaded: factory_manager_confession.pdf', timestamp: formatISO(subDays(now, 60)) },
  { id: 'al_g1_7', caseId: 'case_g1', actorId: 'user_2', action: 'Complaint and evidence is analyzed.', timestamp: formatISO(subDays(now, 50)) },
  { id: 'al_g1_8', caseId: 'case_g1', actorId: 'user_2', action: 'Preliminary assessment report (PAR) is prepared with recommendations on how to address the complaint and shared with the company.', timestamp: formatISO(subDays(now, 15)) },
  { id: 'al_g1_9', caseId: 'case_g1', actorId: 'user_2', action: 'Complaint is closed from TAC after submission of PAR.', timestamp: formatISO(subDays(now, 10)) },

  // --- Case G2 Audit Logs ---
  { id: 'al_g2_1', caseId: 'case_g2', actorId: 'System', action: 'Case automatically created from Email intake.', timestamp: formatISO(subDays(now, 5)) },
  { id: 'al_g2_2', caseId: 'case_g2', actorId: 'user_2', action: 'Acknowledged to the complainant and company is informed about the complaint (identity withheld).', timestamp: formatISO(subDays(now, 4.9)) },
  { id: 'al_g2_3', caseId: 'case_g2', actorId: 'user_2', action: 'Conversation with the complainant is commenced and additional information and evidence is sought.', timestamp: formatISO(subDays(now, 4.9)) },
  { id: 'al_g2_4', caseId: 'case_g2', actorId: 'System', action: 'Evidence file uploaded: aws_cloudtrail_s3_access.json', timestamp: formatISO(subDays(now, 4.8)) },
  { id: 'al_g2_5', caseId: 'case_g2', actorId: 'user_2', action: 'Complaint and evidence is analyzed.', timestamp: formatISO(subDays(now, 1)) },

  // --- Case S1 Audit Logs ---
  { id: 'al_s1_1', caseId: 'case_s1', actorId: 'System', action: 'Case automatically created from Email intake.', timestamp: formatISO(subDays(now, 60)) },
  { id: 'al_s1_2', caseId: 'case_s1', actorId: 'user_2', action: 'Acknowledged to the complainant and company is informed about the complaint (identity withheld).', timestamp: formatISO(subDays(now, 59)) },
  { id: 'al_s1_3', caseId: 'case_s1', actorId: 'user_2', action: 'Conversation with the complainant is commenced and additional information and evidence is sought.', timestamp: formatISO(subDays(now, 55)) },
  { id: 'al_s1_4', caseId: 'case_s1', actorId: 'System', action: 'Evidence file uploaded: crowdstrike_dlp_alert.pdf', timestamp: formatISO(subDays(now, 53)) },
  { id: 'al_s1_5', caseId: 'case_s1', actorId: 'System', action: 'Evidence file uploaded: chain_of_custody_usb.pdf', timestamp: formatISO(subDays(now, 53)) },
  { id: 'al_s1_6', caseId: 'case_s1', actorId: 'System', action: 'Evidence file uploaded: cctv_server_room.mp4', timestamp: formatISO(subDays(now, 50)) },
  { id: 'al_s1_7', caseId: 'case_s1', actorId: 'user_2', action: 'Complaint and evidence is analyzed.', timestamp: formatISO(subDays(now, 30)) },
  { id: 'al_s1_8', caseId: 'case_s1', actorId: 'user_2', action: 'Preliminary assessment report (PAR) is prepared with recommendations on how to address the complaint and shared with the company.', timestamp: formatISO(subDays(now, 10)) },
  { id: 'al_s1_9', caseId: 'case_s1', actorId: 'user_2', action: 'Complaint is closed from TAC after submission of PAR.', timestamp: formatISO(subDays(now, 5)) },

  // --- Case S2 Audit Logs ---
  { id: 'al_s2_1', caseId: 'case_s2', actorId: 'System', action: 'Case automatically created from Hotline intake.', timestamp: formatISO(subDays(now, 20)) },
  { id: 'al_s2_2', caseId: 'case_s2', actorId: 'user_4', action: 'Acknowledged to the complainant and company is informed about the complaint (identity withheld).', timestamp: formatISO(subDays(now, 19)) },
  { id: 'al_s2_3', caseId: 'case_s2', actorId: 'user_4', action: 'Conversation with the complainant is commenced and additional information and evidence is sought.', timestamp: formatISO(subDays(now, 18)) },
  { id: 'al_s2_4', caseId: 'case_s2', actorId: 'System', action: 'Evidence file uploaded: state_biz_registry_gourmet_galore.pdf', timestamp: formatISO(subDays(now, 15)) },
  { id: 'al_s2_5', caseId: 'case_s2', actorId: 'user_4', action: 'Complaint and evidence is analyzed.', timestamp: formatISO(subDays(now, 5)) },
];
