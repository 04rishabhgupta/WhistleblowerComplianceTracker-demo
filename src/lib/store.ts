import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Case, Correspondence, InternalNote, Call, AuditLog, ClientOrganization } from './types';
import { MOCK_USERS, MOCK_CASES, MOCK_CORRESPONDENCE, MOCK_INTERNAL_NOTES, MOCK_CALLS, MOCK_AUDIT_LOGS, MOCK_ORGANIZATIONS } from './mock-data';
import { formatISO } from 'date-fns';

interface AppState {
  activeUser: User | null;
  users: User[];
  organizations: ClientOrganization[];
  cases: Case[];
  correspondences: Correspondence[];
  internalNotes: InternalNote[];
  calls: Call[];
  auditLogs: AuditLog[];
  
  // Actions
  setActiveUser: (userId: string) => void;
  addCase: (newCase: Omit<Case, 'id' | 'caseNumber' | 'createdAt' | 'updatedAt'>) => string;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  addCorrespondence: (correspondence: Omit<Correspondence, 'id' | 'timestamp'>) => void;
  addInternalNote: (note: Omit<InternalNote, 'id' | 'timestamp'>) => void;
  linkCallToCase: (callId: string, caseId: string) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  addOrganization: (org: Omit<ClientOrganization, 'id'>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
  activeUser: null, // Default to null to trigger role selector
  users: MOCK_USERS,
  organizations: MOCK_ORGANIZATIONS,
  cases: MOCK_CASES,
  correspondences: MOCK_CORRESPONDENCE,
  internalNotes: MOCK_INTERNAL_NOTES,
  calls: MOCK_CALLS,
  auditLogs: MOCK_AUDIT_LOGS,

  setActiveUser: (userId) => {
    const user = get().users.find((u) => u.id === userId);
    if (user) {
      set({ activeUser: user });
    }
  },

  addCase: (newCaseData) => {
    const now = formatISO(new Date());
    const newId = `case_${Math.random().toString(36).substr(2, 9)}`;
    // Generate a random case number
    const caseNumber = `TARI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newCase: Case = {
      ...newCaseData,
      id: newId,
      caseNumber,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({ cases: [newCase, ...state.cases] }));

    get().addAuditLog({
      caseId: newId,
      actorId: 'System',
      action: `Case automatically created from ${newCaseData.source} intake.`
    });

    return caseNumber;
  },

  updateCase: (caseId, updates) => {
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId ? { ...c, ...updates, updatedAt: formatISO(new Date()) } : c
      ),
    }));

    get().addAuditLog({
      caseId,
      actorId: get().activeUser?.id || 'System',
      action: `Updated case details: ${Object.keys(updates).join(', ')}`,
    });
  },

  addCorrespondence: (data) => {
    const newCorr: Correspondence = {
      ...data,
      id: `corr_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: formatISO(new Date()),
    };
    set((state) => ({ correspondences: [...state.correspondences, newCorr] }));
    
    get().addAuditLog({
      caseId: data.caseId,
      actorId: get().activeUser?.id || 'System',
      action: `Added new correspondence.`,
    });
  },

  addInternalNote: (data) => {
    const newNote: InternalNote = {
      ...data,
      id: `note_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: formatISO(new Date()),
    };
    set((state) => ({ internalNotes: [...state.internalNotes, newNote] }));
    
    get().addAuditLog({
      caseId: data.caseId,
      actorId: get().activeUser?.id || 'System',
      action: `Added internal note.`,
    });
  },

  linkCallToCase: (callId, caseId) => {
    set((state) => ({
      calls: state.calls.map((c) =>
        c.id === callId ? { ...c, caseId } : c
      ),
    }));
    
    get().addAuditLog({
      caseId,
      actorId: get().activeUser?.id || 'System',
      action: `Linked call ${callId} to case.`,
    });
  },

  addAuditLog: (logData) => {
    const newLog: AuditLog = {
      ...logData,
      id: `audit_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: formatISO(new Date()),
    };
    set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
  },

  addOrganization: (orgData) => {
    const newOrg: ClientOrganization = {
      ...orgData,
      id: `org_${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({ organizations: [...state.organizations, newOrg] }));
  },
    }),
    {
      name: 'tari-compliance-storage',
    }
  )
);
