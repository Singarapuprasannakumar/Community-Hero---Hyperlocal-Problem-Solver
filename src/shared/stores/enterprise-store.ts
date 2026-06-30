import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CaseApproval, AuditEvent, SLATimer, IntegrationStatus, WorkflowStage } from "../types/enterprise-types";

// ==========================================
// 1. OPERATIONS CASES STORE
// ==========================================
interface CaseState {
  workflows: WorkflowStage[];
  updateWorkflowStage: (stageId: string, updates: Partial<WorkflowStage>) => void;
}

const mockWorkflows: WorkflowStage[] = [
  { id: "wf-1", name: "Issue Intake", sequence: 1, status: "completed", slaHours: 2 },
  { id: "wf-2", name: "AI Review & Triage", sequence: 2, status: "completed", slaHours: 4 },
  { id: "wf-3", name: "Community Verification", sequence: 3, status: "completed", slaHours: 24 },
  { id: "wf-4", name: "Department Assignment", sequence: 4, status: "active", assignedTeam: "Roads & Transit", slaHours: 4 },
  { id: "wf-5", name: "Officer Assignment", sequence: 5, status: "pending", slaHours: 2 },
  { id: "wf-6", name: "Field Inspection", sequence: 6, status: "pending", slaHours: 12 },
  { id: "wf-7", name: "Resolution Repair", sequence: 7, status: "pending", slaHours: 48 },
  { id: "wf-8", name: "Quality Check & Close", sequence: 8, status: "pending", slaHours: 24 }
];

export const useCaseStore = create<CaseState>((set) => ({
  workflows: mockWorkflows,
  updateWorkflowStage: (stageId, updates) =>
    set((state) => ({
      workflows: state.workflows.map((wf) => (wf.id === stageId ? { ...wf, ...updates } : wf)),
    })),
}));

// ==========================================
// 2. SLA TIMERS MONITOR STORE
// ==========================================
interface SLAState {
  slaTimers: SLATimer[];
  tickTimers: () => void;
  addSLATimer: (timer: SLATimer) => void;
}

const mockSLATimers: SLATimer[] = [
  { caseId: "iss-1", refNumber: "INC-2026-0001", category: "Roads & Transit", slaType: "resolution", secondsRemaining: 3600 * 14.5, totalSeconds: 3600 * 48, warningThresholdPercent: 10, status: "nominal" },
  { caseId: "iss-2", refNumber: "INC-2026-0002", category: "Water Supply", slaType: "response", secondsRemaining: 1800, totalSeconds: 3600 * 4, warningThresholdPercent: 15, status: "warning" },
  { caseId: "iss-3", refNumber: "INC-2026-0003", category: "Sanitation", slaType: "inspection", secondsRemaining: 0, totalSeconds: 3600 * 12, warningThresholdPercent: 10, status: "breached" }
];

export const useSlaStore = create<SLAState>((set) => ({
  slaTimers: mockSLATimers,
  tickTimers: () =>
    set((state) => ({
      slaTimers: state.slaTimers.map((t) => {
        if (t.secondsRemaining <= 0) {
          return { ...t, secondsRemaining: 0, status: "breached" };
        }
        const nextSecs = t.secondsRemaining - 1;
        const pct = (nextSecs / t.totalSeconds) * 100;
        const nextStatus = pct <= t.warningThresholdPercent ? "warning" : "nominal";
        return { ...t, secondsRemaining: nextSecs, status: nextStatus };
      }),
    })),
  addSLATimer: (timer) => set((state) => ({ slaTimers: [...state.slaTimers, timer] })),
}));

// ==========================================
// 3. APPROVAL CONSOLE STORE
// ==========================================
interface ApprovalState {
  approvals: CaseApproval[];
  approveRequest: (id: string, approver: string, comment?: string) => void;
  rejectRequest: (id: string, approver: string, comment?: string) => void;
}

const mockApprovals: CaseApproval[] = [
  { id: "app-1", caseId: "iss-1", refNumber: "INC-2026-0001", title: "Residency Road Pothole patching", requestType: "budget", requestDetails: "Extra asphalt bags and machinery rental costs", amount: 45000, requesterName: "Officer Ramesh Kumar", status: "pending", createdAt: new Date().toISOString() },
  { id: "app-2", caseId: "iss-2", refNumber: "INC-2026-0002", title: "Indiranagar Drain block bypass", requestType: "closure", requestDetails: "AI resolution verified on-site. Ready for executive signoff.", requesterName: "Officer Sarah Jones", status: "pending", createdAt: new Date().toISOString() }
];

export const useApprovalStore = create<ApprovalState>((set) => ({
  approvals: mockApprovals,
  approveRequest: (id, approver, comment) =>
    set((state) => ({
      approvals: state.approvals.map((app) =>
        app.id === id
          ? { ...app, status: "approved", approverName: approver, comments: comment, resolvedAt: new Date().toISOString() }
          : app
      ),
    })),
  rejectRequest: (id, approver, comment) =>
    set((state) => ({
      approvals: state.approvals.map((app) =>
        app.id === id
          ? { ...app, status: "rejected", approverName: approver, comments: comment, resolvedAt: new Date().toISOString() }
          : app
      ),
    })),
}));

// ==========================================
// 4. ENTERPRISE SYSTEM AUDIT STORE
// ==========================================
interface AuditState {
  auditLogs: AuditEvent[];
  logEvent: (event: Omit<AuditEvent, "id" | "timestamp">) => void;
}

const mockAuditLogs: AuditEvent[] = [
  { id: "aud-1", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), actorName: "Commissioner Ananya", actorRole: "admin", action: "Approved Monsoon SLA policy update", ip: "192.168.1.42", device: "Chrome 125 on Windows" },
  { id: "aud-2", timestamp: new Date(Date.now() - 3600000).toISOString(), actorName: "AI Runtime Router", actorRole: "system", action: "Auto-escalated INC-2026-0003 due to inspection delay", ip: "127.0.0.1", device: "Inference Engine V2" }
];

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      auditLogs: mockAuditLogs,
      logEvent: (evt) =>
        set((state) => ({
          auditLogs: [
            {
              ...evt,
              id: `aud-${Math.random().toString(36).substr(2)}`,
              timestamp: new Date().toISOString(),
            },
            ...state.auditLogs
          ],
        })),
    }),
    { name: "community-hero-enterprise-audit" }
  )
);

// ==========================================
// 5. INTEGRATIONS SYNC HUB STORE
// ==========================================
interface IntegrationState {
  integrations: IntegrationStatus[];
  toggleStatus: (id: string) => void;
}

const mockIntegrations: IntegrationStatus[] = [
  { id: "int-1", name: "WhatsApp Notification Gateway", status: "connected", latencyMs: 42, lastSyncTime: new Date().toISOString(), healthRate: 99 },
  { id: "int-2", name: "IMD Weather Forecast Webhook", status: "connected", latencyMs: 120, lastSyncTime: new Date().toISOString(), healthRate: 97 },
  { id: "int-3", name: "NIC Municipal ERP Sync", status: "syncing", latencyMs: 240, lastSyncTime: new Date().toISOString(), healthRate: 94 },
  { id: "int-4", name: "Ward Smart IoT Trash Level Sensors", status: "connected", latencyMs: 65, lastSyncTime: new Date().toISOString(), healthRate: 98 }
];

export const useIntegrationStore = create<IntegrationState>((set) => ({
  integrations: mockIntegrations,
  toggleStatus: (id) =>
    set((state) => ({
      integrations: state.integrations.map((int) =>
        int.id === id
          ? {
              ...int,
              status: int.status === "connected" ? "disconnected" : "connected",
              latencyMs: int.status === "connected" ? 0 : Math.round(Math.random() * 80 + 30),
              lastSyncTime: new Date().toISOString(),
            }
          : int
      ),
    })),
}));
