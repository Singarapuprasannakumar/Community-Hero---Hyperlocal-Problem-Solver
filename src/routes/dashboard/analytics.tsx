import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TrendingUp, FileText, Download, Building, CheckCircle, BarChart3, PieChart, ShieldAlert } from "lucide-react";
import { useUIStore } from "@/shared/stores/ui-store";
import { useAnalyticsStore } from "@/shared/stores/analytics-store";
import { useIssueStore } from "@/shared/stores/issue-store";
import { KPIGrid } from "@/features/analytics/components/kpi-grid";
import { CategoryDonutChart, HistoricalVolumeChart } from "@/features/analytics/components/charts-library";
import { BudgetIntelWidget } from "@/features/analytics/components/budget-intel";
import { DecisionAdvisory } from "@/features/analytics/components/decision-advisory";
import { analyticsService } from "@/shared/services/analytics-service";
import { DeptScorecard } from "@/shared/types/analytics-types";
import { Reveal } from "@/lib/motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({
    meta: [
      { title: "Executive Analytics — Community Hero AI" },
    ],
  }),
  component: ExecutiveAnalyticsPage,
});

type TabType = "overview" | "budget" | "advisory" | "reports";

function ExecutiveAnalyticsPage() {
  const { setBreadcrumbs } = useUIStore();
  const { kpis, initializeKPIs } = useAnalyticsStore();
  const { issues, initializeDatabase } = useIssueStore();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [scorecards, setScorecards] = useState<DeptScorecard[]>([]);

  useEffect(() => {
    initializeDatabase();
    initializeKPIs();
    setBreadcrumbs([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Executive Intelligence" },
    ]);
  }, [setBreadcrumbs, initializeDatabase, initializeKPIs]);

  // Compute department scorecards from active Issues database
  useEffect(() => {
    if (issues.length > 0) {
      analyticsService.getDepartmentScorecards(issues).then((res) => {
        setScorecards(res);
      });
    }
  }, [issues]);

  const handleDownloadReport = (name: string) => {
    toast.success(`Consolidating document: '${name}' successfully generated as PDF.`);
  };

  const tabsConfig = [
    { id: "overview" as TabType, name: "Executive Stats", icon: BarChart3 },
    { id: "budget" as TabType, name: "Financial Ledger", icon: PieChart },
    { id: "advisory" as TabType, name: "Decision Advisories", icon: ShieldAlert },
    { id: "reports" as TabType, name: "Compiled Reports", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Executive Intelligence Center</h1>
            <p className="text-sm text-muted-foreground">Strategic dashboard, forecasting risk models, and AI action advisories.</p>
          </div>
        </div>
      </Reveal>

      {/* Tabs navigation */}
      <Reveal>
        <div className="flex border border-border bg-card rounded-2xl p-1 overflow-x-auto gap-1">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all hover:bg-secondary",
                  isActive ? "bg-primary text-primary-foreground hover:bg-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Tab panel rendering */}
      <Reveal>
        <div className="mt-4">
          {/* TAB 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* KPIs Grid */}
              <KPIGrid kpis={kpis} />

              {/* Chart visualizations */}
              <div className="grid gap-6 md:grid-cols-2">
                <HistoricalVolumeChart />
                <CategoryDonutChart />
              </div>

              {/* Department scorecards */}
              {scorecards.length > 0 && (
                <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Department SLA Scorecard
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground font-semibold">
                          <th className="pb-3">Department</th>
                          <th className="pb-3">Tickets Assigned</th>
                          <th className="pb-3">Tickets Resolved</th>
                          <th className="pb-3">SLA Compliance</th>
                          <th className="pb-3">Avg Fix Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scorecards.map((score) => (
                          <tr key={score.departmentName} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                            <td className="py-3 font-semibold">{score.departmentName}</td>
                            <td className="py-3">{score.assignedCount}</td>
                            <td className="py-3">{score.resolvedCount}</td>
                            <td className="py-3 text-success font-semibold">{score.slaCompliancePercent}%</td>
                            <td className="py-3">{score.averageResolutionHours} Hours</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Budget */}
          {activeTab === "budget" && <BudgetIntelWidget />}

          {/* TAB 3: Decision Advisory */}
          {activeTab === "advisory" && <DecisionAdvisory />}

          {/* TAB 4: Compiled Reports */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Executive Performance Reports</h2>
                <p className="text-xs text-muted-foreground mt-1">Download monthly and weekly performance summaries.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Daily Incident Triage Summary",
                  "Weekly SLA & Cost Audit Report",
                  "Monthly Infrastructure Quality Index",
                  "Annual Civic Sustainability Review",
                ].map((name) => (
                  <div key={name} className="flex items-center justify-between border border-border bg-card p-4 rounded-3xl shadow-soft">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
                        <FileText className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">{name}</h4>
                        <span className="text-[10px] text-muted-foreground">PDF document · compiled automatically</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadReport(name)}
                      className="rounded-xl border border-border bg-background p-2 text-primary hover:bg-secondary transition-all"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
export default ExecutiveAnalyticsPage;
