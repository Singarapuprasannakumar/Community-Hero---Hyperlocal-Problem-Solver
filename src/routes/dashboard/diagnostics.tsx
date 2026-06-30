import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Heart, Activity, Wifi, Shield } from "lucide-react";
import { useUIStore } from "@/shared/stores/ui-store";
import { useOfflineStore } from "@/shared/stores/offline-store";
import { HealthMonitor } from "@/features/diagnostics/components/health-monitor";
import { AccessibilityPanel } from "@/features/diagnostics/components/accessibility-toggle";
import { Reveal } from "@/lib/motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/diagnostics")({
  head: () => ({
    meta: [
      { title: "System Health & PWA — Community Hero AI" },
    ],
  }),
  component: SystemDiagnosticsPage,
});

function SystemDiagnosticsPage() {
  const { setBreadcrumbs } = useUIStore();
  const { isOnline, setOnlineStatus, actionQueue } = useOfflineStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", to: "/dashboard" },
      { label: "System Health Center" },
    ]);
  }, [setBreadcrumbs]);

  const handleSimulateConnection = () => {
    const nextStatus = !isOnline;
    setOnlineStatus(nextStatus);
    toast.success(nextStatus ? "Reconnected to municipal network." : "Entered offline emergency mode.");
  };

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Health Center</h1>
            <p className="text-sm text-muted-foreground">Monitor real-time infrastructure metrics, PWA status, and accessibility options.</p>
          </div>

          <button
            onClick={handleSimulateConnection}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-glow transition-all",
              isOnline ? "bg-warning text-warning-foreground hover:bg-warning/90" : "bg-success text-success-foreground hover:bg-success/90"
            )}
          >
            <Wifi className="h-4 w-4" />
            <span>{isOnline ? "Simulate Offline Mode" : "Simulate Online Mode"}</span>
          </button>
        </div>
      </Reveal>

      {/* Health metrics and logs panel */}
      <Reveal>
        <HealthMonitor />
      </Reveal>

      {/* Accessibility preference panel */}
      <Reveal>
        <AccessibilityPanel />
      </Reveal>

      {/* Config environment dashboard variables */}
      <Reveal>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Shield className="h-4.5 w-4.5 text-primary" />
            <span>Environment Configuration variables</span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="border border-border/60 bg-secondary/15 rounded-xl p-3">
              <span className="text-[10px] text-muted-foreground font-mono block">VITE_MOCK_INFRASTRUCTURE</span>
              <span className="font-bold text-foreground mt-1 block">{String(import.meta.env.VITE_MOCK_INFRASTRUCTURE ?? "true")}</span>
            </div>
            <div className="border border-border/60 bg-secondary/15 rounded-xl p-3">
              <span className="text-[10px] text-muted-foreground font-mono block">VITE_AI_RUNTIME_PROVIDER</span>
              <span className="font-bold text-foreground mt-1 block">{import.meta.env.VITE_AI_RUNTIME_PROVIDER || "MockGeminiAPI"}</span>
            </div>
            <div className="border border-border/60 bg-secondary/15 rounded-xl p-3">
              <span className="text-[10px] text-muted-foreground font-mono block">VITE_PWA_OFFLINE_CACHE</span>
              <span className="font-bold text-foreground mt-1 block">{import.meta.env.VITE_PWA_OFFLINE_CACHE || "active"}</span>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
export default SystemDiagnosticsPage;
