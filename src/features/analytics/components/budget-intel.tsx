import { useBudgetStore } from "@/shared/stores/analytics-store";
import { DollarSign, Award, TrendingUp, Sparkles } from "lucide-react";

export function BudgetIntelWidget() {
  const { budget } = useBudgetStore();

  const spentPercent = Math.round((budget.utilized / budget.allocated) * 100);

  const metrics = [
    { label: "Cost Per Resolved Issue", val: `₹${budget.costPerIssue}`, icon: DollarSign, color: "text-blue-500 bg-blue-500/10" },
    { label: "AI Optimization Savings", val: `₹${budget.savingsFromAI.toLocaleString()}`, icon: Sparkles, color: "text-purple-500 bg-purple-500/10" },
    { label: "Volunteer Labor Value", val: `₹${budget.volunteerHoursValue.toLocaleString()}`, icon: Award, color: "text-emerald-500 bg-emerald-500/10" },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Municipal Budget Utilization
      </h3>

      {/* Progress Bars */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between font-semibold">
          <span>Allocated Capital Utilization</span>
          <span>{spentPercent}% spent</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${spentPercent}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground/80 pt-1">
          <span>Spent: ₹{(budget.utilized / 100000).toFixed(1)}L</span>
          <span>Allocated: ₹{(budget.allocated / 100000).toFixed(1)}L</span>
        </div>
      </div>

      {/* Financial grid cards */}
      <div className="grid gap-3 sm:grid-cols-3 pt-2">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="border border-border/60 bg-secondary/15 rounded-2xl p-3 space-y-2 text-xs">
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-xl ${m.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div>
                <span className="text-[10px] text-muted-foreground block truncate">{m.label}</span>
                <span className="font-bold text-foreground mt-0.5 block">{m.val}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default BudgetIntelWidget;
