import { useEffect } from "react";
import { useSlaStore } from "@/shared/stores/enterprise-store";
import { AlertTriangle, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function SLAMonitor() {
  const { slaTimers, tickTimers } = useSlaStore();

  useEffect(() => {
    const timer = setInterval(() => {
      tickTimers();
    }, 1000);
    return () => clearInterval(timer);
  }, [tickTimers]);

  const formatDuration = (sec: number) => {
    if (sec <= 0) return "Breached";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <Clock className="h-4.5 w-4.5 text-primary" />
        <span>SLA Resolution Monitor</span>
      </h3>
      <div className="space-y-4">
        {slaTimers.map((t) => {
          const isWarning = t.status === "warning";
          const isBreached = t.status === "breached";
          
          const progressPercent = Math.min(100, Math.max(0, (t.secondsRemaining / t.totalSeconds) * 100));

          return (
            <div key={t.caseId} className="border border-border/60 bg-secondary/10 p-4 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-foreground block">{t.refNumber}</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5 font-semibold capitalize">{t.category} · {t.slaType} SLA</span>
                </div>
                
                <span className={cn(
                  "font-mono font-bold px-2 py-0.5 rounded-lg border",
                  isBreached ? "bg-destructive/10 border-destructive/20 text-destructive animate-pulse" :
                  isWarning ? "bg-warning/10 border-warning/20 text-warning" :
                  "bg-success/10 border-success/20 text-success"
                )}>
                  {formatDuration(t.secondsRemaining)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-1000",
                      isBreached ? "bg-destructive" : isWarning ? "bg-warning" : "bg-success"
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] text-muted-foreground/80 font-bold uppercase tracking-wide pt-0.5">
                  <span>Target: {Math.round(t.totalSeconds / 3600)}h limit</span>
                  <span>{Math.round(progressPercent)}% SLA remaining</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default SLAMonitor;
