import { simulateNetwork } from "./base-service";
import { useAuditStore } from "../stores/enterprise-store";
import { UserRole } from "../types/user-types";

export const auditService = {
  async logAction(actorName: string, role: UserRole | "system", action: string, prev?: string, next?: string) {
    const { logEvent } = useAuditStore.getState();
    logEvent({
      actorName,
      actorRole: role,
      action,
      previousValue: prev,
      newValue: next,
      ip: "192.168.1.100",
      device: "Admin Dashboard Console"
    });
    return simulateNetwork(true);
  }
};

export const automationService = {
  async runSLAAutomations() {
    // Runs conditions matching: auto-escalate overdue tickets, assign volunteers
    return simulateNetwork({
      escalatedCount: 2,
      assignedOfficersCount: 1,
      remindersSentCount: 8,
    });
  }
};
