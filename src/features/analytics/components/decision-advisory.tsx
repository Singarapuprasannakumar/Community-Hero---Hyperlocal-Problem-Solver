import { useInsightsStore } from "@/shared/stores/analytics-store";
import { Sparkles, Check, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DecisionAdvisory() {
  const { insights, approveInsight } = useInsightsStore();

  const handleApprove = (id: string, recommendation: string) => {
    approveInsight(id);
    toast.success(`Executive Action Confirmed: '${recommendation}' has been dispatched to operations.`);
  };

  const activeInsights = insights.filter((ins) => ins.status === "pending");

  if (activeInsights.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-5 text-center text-xs text-muted-foreground shadow-soft">
        <ShieldCheck className="h-6 w-6 text-success mx-auto mb-2" />
        All strategic AI advisories have been approved and dispatched.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <h3 className="text-xs font-bold flex items-center gap-1.5 border-b border-border pb-3 uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-4.5 w-4.5 text-primary" />
        <span>Executive Decision Advisories</span>
      </h3>
      <div className="space-y-4">
        {activeInsights.map((ins) => (
          <div key={ins.id} className="border border-border bg-secondary/15 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-foreground block text-sm">{ins.recommendation}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {ins.affectedWards.join(", ")}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
                {(ins.confidenceScore * 100).toFixed(0)}% Confidence
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{ins.reasoning}</p>

            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <div className="grid grid-cols-2 gap-3 text-[10px] text-muted-foreground">
                <div>
                  <span>Est Cost:</span>
                  <span className="font-bold text-foreground ml-1">₹{(ins.estimatedCost / 100000).toFixed(1)}L</span>
                </div>
                <div>
                  <span>Priority:</span>
                  <span className="font-bold text-foreground ml-1 capitalize">{ins.priority}</span>
                </div>
              </div>

              <button
                onClick={() => handleApprove(ins.id, ins.recommendation)}
                className="inline-flex items-center gap-1 rounded-xl bg-primary px-3.5 py-1.5 text-[10px] font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-glow"
              >
                <span>Authorize Action</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default DecisionAdvisory;
