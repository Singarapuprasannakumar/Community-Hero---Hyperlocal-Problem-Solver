import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, ListTodo, Clock, DollarSign, ShieldAlert, Radio, RefreshCw } from "lucide-react";
import { useUIStore } from "@/shared/stores/ui-store";
import { CaseQueue } from "@/features/enterprise/components/case-queue";
import { SLAMonitor } from "@/features/enterprise/components/sla-timers";
import { ApprovalConsole } from "@/features/enterprise/components/approval-console";
import { AuditHistory } from "@/features/enterprise/components/audit-history";
import { useIntegrationStore } from "@/shared/stores/enterprise-store";
import { Reveal } from "@/lib/motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({
    meta: [
      { title: "Operations Center — Community Hero AI" },
    ],
  }),
  component: OperationsCenterPage,
});

type TabType = "queue" | "approvals" | "audits" | "integrations";

function OperationsCenterPage() {
  const { setBreadcrumbs } = useUIStore();
  const [activeTab, setActiveTab] = useState<TabType>("queue");
  const { integrations, toggleStatus } = useIntegrationStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Operations Center" },
    ]);
  }, [setBreadcrumbs]);

  const tabsConfig = [
    { id: "queue" as TabType, name: "Live Operations", icon: ListTodo },
    { id: "approvals" as TabType, name: "Pending Approvals", icon: DollarSign },
    { id: "audits" as TabType, name: "Audit Trail logs", icon: ShieldAlert },
    { id: "integrations" as TabType, name: "Integrations Hub", icon: Radio },
  ];

  const handleSync = (name: string) => {
    toast.success(`Sync successfully completed for ${name}.`);
  };

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Operations Center</h1>
            <p className="text-sm text-muted-foreground">Manage live dispatch schedules, SLA metrics, approvals, and integrations.</p>
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
          {/* TAB 1: Live Operations queues */}
          {activeTab === "queue" && (
            <div className="grid gap-6 md:grid-cols-2">
              <CaseQueue />
              <SLAMonitor />
            </div>
          )}

          {/* TAB 2: Approvals console */}
          {activeTab === "approvals" && <ApprovalConsole />}

          {/* TAB 3: Audit history logs */}
          {activeTab === "audits" && <AuditHistory />}

          {/* TAB 4: External Integrations gateway */}
          {activeTab === "integrations" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">System Integrations Sync Hub</h2>
                <p className="text-xs text-muted-foreground mt-1">Connect municipal messaging gateways, weather sensors, and database APIs.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {integrations.map((int) => (
                  <div key={int.id} className="border border-border bg-card p-5 rounded-3xl shadow-soft space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-sm block text-foreground">{int.name}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">
                          Last Sync: {new Date(int.lastSyncTime).toLocaleTimeString()}
                        </span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase",
                        int.status === "connected" ? "bg-success/10 border-success/20 text-success" :
                        int.status === "syncing" ? "bg-primary/10 border-primary/20 text-primary animate-pulse" :
                        "bg-muted border-border text-muted-foreground"
                      )}>
                        {int.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-border/40 pt-3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground block">Latency Ms</span>
                        <span className="font-bold text-foreground font-mono">{int.latencyMs > 0 ? `${int.latencyMs}ms` : "—"}</span>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-[10px] text-muted-foreground block">Sync Health</span>
                        <span className="font-bold text-foreground font-mono">{int.healthRate}%</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => handleSync(int.name)}
                        className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 hover:bg-secondary transition-all font-semibold text-xs"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Force Sync</span>
                      </button>
                      <button
                        onClick={() => toggleStatus(int.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-primary text-primary-foreground px-3.5 py-1.5 hover:bg-primary/95 transition-all font-semibold text-xs shadow-glow"
                      >
                        <span>Toggle Status</span>
                      </button>
                    </div>
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
export default OperationsCenterPage;
