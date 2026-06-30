import { useAIStore } from "@/shared/stores/ai-store";
import { Sparkles, Check, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIRecommendationsWidget() {
  const { recommendations, applyRecommendation, initializeAIStore } = useAIStore();

  const activeRecs = recommendations.filter((r) => r.status === "pending");

  if (activeRecs.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card/60 p-5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="h-6 w-6 text-success mx-auto mb-2" />
        No pending triage recommendations.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <h3 className="text-xs font-bold flex items-center gap-1.5 border-b border-border pb-3">
        <Sparkles className="h-4.5 w-4.5 text-primary" />
        <span>AI Action Recommendations</span>
      </h3>
      <div className="space-y-3">
        {activeRecs.map((rec) => (
          <div key={rec.id} className="border border-border/80 rounded-2xl p-3 bg-secondary/20 space-y-2 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="truncate max-w-[170px]">{rec.title}</span>
              <span className="text-[10px] text-success">{(rec.confidenceScore * 100).toFixed(0)}% Conf</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal">{rec.description}</p>
            <div className="flex justify-end pt-1">
              <button
                onClick={() => applyRecommendation(rec.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground hover:bg-primary/95 transition-all"
              >
                <span>Apply Action</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AIModelLatencyWidget() {
  const { models } = useAIStore();

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-3">
      <h3 className="text-xs font-bold flex items-center gap-1.5 border-b border-border pb-2.5">
        <Cpu className="h-4.5 w-4.5 text-primary" />
        <span>AI Intelligence Runtime</span>
      </h3>
      <div className="space-y-2.5 text-[11px]">
        {models.map((mod) => (
          <div key={mod.name} className="flex justify-between">
            <span className="text-muted-foreground">{mod.name}:</span>
            <span className="font-semibold text-success">{mod.latencyMs}ms ({mod.accuracy * 100}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
