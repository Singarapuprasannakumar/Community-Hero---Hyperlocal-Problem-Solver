export interface ExecutiveKPI {
  metricName: string;
  currentValue: number;
  targetValue: number;
  trend: "up" | "down" | "stable";
  status: "success" | "warning" | "danger" | "neutral";
  confidenceScore: number; // 0.0 to 1.0
  category: "operational" | "community" | "ai" | "sustainability" | "governance";
}

export interface BudgetIntel {
  allocated: number;
  utilized: number;
  remaining: number;
  costPerIssue: number;
  savingsFromAI: number;
  volunteerHoursValue: number;
  projectedSpending: number;
}

export interface RiskForecast {
  metricName: string;
  historicalValue: number;
  predictedValue: number;
  emergencyProbability: number; // 0 to 100
  trend: "up" | "down" | "stable";
}

export interface DeptScorecard {
  departmentName: string;
  assignedCount: number;
  resolvedCount: number;
  slaCompliancePercent: number;
  averageResolutionHours: number;
  budgetUtilizationPercent: number;
}

export interface AIExecutiveInsight {
  id: string;
  recommendation: string;
  reasoning: string;
  confidenceScore: number;
  estimatedCost: number;
  priority: "high" | "medium" | "low";
  affectedWards: string[];
  status: "pending" | "approved" | "rejected";
}
