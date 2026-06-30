import { UserRole } from "../types/user-types";

export interface CaseApproval {
  id: string;
  caseId: string;
  refNumber: string;
  title: string;
  requestType: "budget" | "closure" | "escalation" | "emergency";
  requestDetails: string;
  amount?: number;
  requesterName: string;
  status: "pending" | "approved" | "rejected";
  comments?: string;
  approverName?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole | "system";
  action: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  ip: string;
  device: string;
}

export interface SLATimer {
  caseId: string;
  refNumber: string;
  category: string;
  slaType: "response" | "resolution" | "inspection" | "escalation";
  secondsRemaining: number;
  totalSeconds: number;
  warningThresholdPercent: number; // e.g. 10
  status: "nominal" | "warning" | "breached";
}

export interface IntegrationStatus {
  id: string;
  name: string;
  status: "connected" | "disconnected" | "syncing" | "error";
  latencyMs: number;
  lastSyncTime: string;
  healthRate: number; // percentage
}

export interface WorkflowStage {
  id: string;
  name: string;
  sequence: number;
  status: string;
  assignedTeam?: string;
  slaHours: number;
}
