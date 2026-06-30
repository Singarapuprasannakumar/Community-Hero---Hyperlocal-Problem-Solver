import { simulateNetwork } from "./base-service";
import { Issue } from "../types/issue-types";
import { DeptScorecard } from "../types/analytics-types";

export const analyticsService = {
  async getDepartmentScorecards(issues: Issue[]): Promise<DeptScorecard[]> {
    // Group and calculate department metrics dynamically from Issue database
    const depts: Record<string, { assigned: number; resolved: number; totalHours: number; compliant: number }> = {};
    
    issues.forEach((iss) => {
      const deptName = iss.department || "Other Operations";
      if (!depts[deptName]) {
        depts[deptName] = { assigned: 0, resolved: 0, totalHours: 0, compliant: 0 };
      }
      
      depts[deptName].assigned++;
      
      const isResolved = iss.status === "resolved" || iss.status === "closed";
      if (isResolved) {
        depts[deptName].resolved++;
        depts[deptName].totalHours += iss.estimatedResolutionHours;
        
        // Check SLA compliance (e.g. resolved in under 48 hours)
        if (iss.estimatedResolutionHours <= 48) {
          depts[deptName].compliant++;
        }
      }
    });

    const scorecards: DeptScorecard[] = Object.keys(depts).map((name) => {
      const d = depts[name];
      const compliance = d.resolved > 0 ? Math.round((d.compliant / d.resolved) * 100) : 100;
      const avgHours = d.resolved > 0 ? Math.round(d.totalHours / d.resolved) : 24;
      
      // Seed budget utilization dynamically
      const budgetUtilization = 60 + (name.length % 5) * 8;

      return {
        departmentName: name,
        assignedCount: d.assigned,
        resolvedCount: d.resolved,
        slaCompliancePercent: compliance,
        averageResolutionHours: avgHours,
        budgetUtilizationPercent: budgetUtilization,
      };
    });

    return simulateNetwork(scorecards);
  }
};
