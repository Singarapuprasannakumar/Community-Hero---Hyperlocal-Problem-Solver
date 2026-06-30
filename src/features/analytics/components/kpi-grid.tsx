import { ExecutiveKPI } from "@/shared/types/analytics-types";
import { ArrowUpRight, ArrowDownRight, Activity, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIGridProps {
  kpis: ExecutiveKPI[];
}

export function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => {
        const isUp = k.trend === "up";
        const isWarning = k.status === "warning";
        const isDanger = k.status === "danger";
        
        const statusColor =
          isDanger ? "text-destructive border-destructive/20 bg-destructive/5" :
          isWarning ? "text-warning border-warning/20 bg-warning/5" :
          "text-success border-success/20 bg-success/5";

        return (
          <div
            key={k.metricName}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-soft hover:border-primary/25 transition-all"
          >
            <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-semibold">
              <span>{k.category}</span>
              <span className={cn("inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 border text-[9px] font-bold", statusColor)}>
                {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span>{k.trend.toUpperCase()}</span>
              </span>
            </div>

            <h4 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
              {k.currentValue.toLocaleString()}
              {k.metricName.includes("Percent") || k.metricName.includes("Rate") || k.metricName.includes("Accuracy") || k.metricName.includes("Confidence") ? "%" : ""}
            </h4>

            <p className="mt-1 text-xs font-semibold text-muted-foreground truncate">
              {k.metricName}
            </p>

            <div className="mt-3 flex justify-between text-[10px] text-muted-foreground/80 border-t border-border/40 pt-2.5">
              <span>Target: {k.targetValue}%</span>
              <span>Conf: {(k.confidenceScore * 100).toFixed(0)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default KPIGrid;
