import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExecutiveKPI, BudgetIntel, RiskForecast, AIExecutiveInsight } from "../types/analytics-types";

// ==========================================
// 1. EXECUTIVE KPIS STORE
// ==========================================
interface AnalyticsState {
  kpis: ExecutiveKPI[];
  initializeKPIs: () => void;
}

const mockKPIs: ExecutiveKPI[] = [
  { metricName: "SLA Compliance Rate", currentValue: 88.5, targetValue: 95.0, trend: "up", status: "success", confidenceScore: 0.94, category: "operational" },
  { metricName: "Average Response Time", currentValue: 14.2, targetValue: 12.0, trend: "down", status: "warning", confidenceScore: 0.91, category: "operational" },
  { metricName: "Citizen Participation Rate", currentValue: 72.4, targetValue: 80.0, trend: "up", status: "success", confidenceScore: 0.88, category: "community" },
  { metricName: "Volunteer Work Hours", currentValue: 2450, targetValue: 3000, trend: "up", status: "success", confidenceScore: 0.95, category: "community" },
  { metricName: "AI Triage Confidence", currentValue: 92.8, targetValue: 90.0, trend: "up", status: "success", confidenceScore: 0.98, category: "ai" },
  { metricName: "Duplicate Report Merges", currentValue: 342, targetValue: 300, trend: "up", status: "success", confidenceScore: 0.96, category: "ai" },
  { metricName: "Carbon Emission Reduced", currentValue: 18.4, targetValue: 20.0, trend: "up", status: "success", confidenceScore: 0.85, category: "sustainability" },
  { metricName: "Municipal Budget Utilized", currentValue: 68.2, targetValue: 100.0, trend: "stable", status: "neutral", confidenceScore: 0.92, category: "governance" },
];

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  kpis: [],
  initializeKPIs: () => set({ kpis: mockKPIs }),
}));

// ==========================================
// 2. FINANCIAL BUDGET STORE
// ==========================================
interface BudgetState {
  budget: BudgetIntel;
  updateBudget: (updates: Partial<BudgetIntel>) => void;
}

const initialBudget: BudgetIntel = {
  allocated: 12500000, // INR
  utilized: 8520000,
  remaining: 3980000,
  costPerIssue: 1420,
  savingsFromAI: 245000,
  volunteerHoursValue: 485000,
  projectedSpending: 11800000,
};

export const useBudgetStore = create<BudgetState>((set) => ({
  budget: initialBudget,
  updateBudget: (updates) =>
    set((state) => ({
      budget: { ...state.budget, ...updates },
    })),
}));

// ==========================================
// 3. RISK FORECASTING STORE
// ==========================================
interface ForecastState {
  forecasts: RiskForecast[];
}

const mockForecasts: RiskForecast[] = [
  { metricName: "Ward 150 Monsoon Flood Risk", historicalValue: 42, predictedValue: 78, emergencyProbability: 84, trend: "up" },
  { metricName: "Ward 80 Road Damage Growth", historicalValue: 18, predictedValue: 32, emergencyProbability: 45, trend: "up" },
  { metricName: "Sanitation Volunteer Demand", historicalValue: 60, predictedValue: 85, emergencyProbability: 60, trend: "up" },
];

export const useForecastStore = create<ForecastState>(() => ({
  forecasts: mockForecasts,
}));

// ==========================================
// 4. STRATEGIC INSIGHTS STORE
// ==========================================
interface InsightsState {
  insights: AIExecutiveInsight[];
  approveInsight: (id: string) => void;
}

const mockInsights: AIExecutiveInsight[] = [
  {
    id: "ins-1",
    recommendation: "Reallocate ₹4.5L Road budget to Ward 150",
    reasoning: "AI predicts 78% growth in monsoon pothole complaints in Ward 150. Immediate pothole patching reduces vehicle damage by 40%.",
    confidenceScore: 0.94,
    estimatedCost: 450000,
    priority: "high",
    affectedWards: ["Ward 150 - Bellandur"],
    status: "pending",
  },
  {
    id: "ins-2",
    recommendation: "Deploy 15 Sanitation volunteers to Ward 80",
    reasoning: "Dumping reports in Ward 80 has exceeded standard density limits by 2.4x. Suggest coordinating weekend RWA cleanup drive.",
    confidenceScore: 0.88,
    estimatedCost: 15000,
    priority: "medium",
    affectedWards: ["Ward 80 - Indiranagar"],
    status: "pending",
  }
];

export const useInsightsStore = create<InsightsState>()(
  persist(
    (set) => ({
      insights: mockInsights,
      approveInsight: (id) =>
        set((state) => ({
          insights: state.insights.map((ins) =>
            ins.id === id ? { ...ins, status: "approved" } : ins
          ),
        })),
    }),
    { name: "community-hero-executive-insights" }
  )
);
