import { useIssueStore } from "@/shared/stores/issue-store";
import { auditService } from "@/shared/services/enterprise-service";
import { useAuthStore } from "@/shared/stores/auth-store";
import { ShieldAlert, RefreshCw, Layers, ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";

export function CaseQueue() {
  const { user } = useAuthStore();
  const { issues, updateIssue } = useIssueStore();

  const handleEscalate = async (issueId: string, refNum: string) => {
    if (!user) return;
    updateIssue(issueId, { status: "escalated" });
    await auditService.logAction(user.name, user.role, `Escalated case ${refNum}`, "high", "escalated");
    toast.error(`Case ${refNum} escalated to highest priority.`);
  };

  const handleTransfer = async (issueId: string, refNum: string, currentDept: string) => {
    if (!user) return;
    const nextDept = currentDept === "Sanitation" ? "BBMP - Roads" : "BBMP - Waste Management";
    updateIssue(issueId, { department: nextDept });
    await auditService.logAction(user.name, user.role, `Transferred case ${refNum} department`, currentDept, nextDept);
    toast.success(`Case ${refNum} transferred to ${nextDept}.`);
  };

  // Filter to first 5 items to keep it clean and virtualized
  const activeCases = issues.slice(0, 5);

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Live Case Operations Queue
      </h3>
      <div className="space-y-3">
        {activeCases.map((c) => (
          <div key={c.id} className="border border-border/80 bg-secondary/15 hover:bg-secondary/35 rounded-2xl p-4 transition-all text-xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-foreground block">{c.title}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 font-mono uppercase bg-secondary/50 px-1.5 py-0.5 rounded">
                  {c.refNumber}
                </span>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                c.priority === "urgent" || c.priority === "high"
                  ? "bg-destructive/10 border-destructive/20 text-destructive"
                  : "bg-primary/10 border-primary/20 text-primary"
              }`}>
                {c.priority.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
              <span>Dept: <span className="font-semibold text-foreground">{c.department || "Unassigned"}</span></span>
              <span>Ward: <span className="font-semibold text-foreground">{c.location?.ward?.split(" - ")[0] || "Ward 80"}</span></span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <button
                onClick={() => handleTransfer(c.id, c.refNumber, c.department || "Sanitation")}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 hover:bg-secondary transition-all font-semibold"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Transfer</span>
              </button>
              <button
                onClick={() => handleEscalate(c.id, c.refNumber)}
                disabled={c.status === "escalated"}
                className="inline-flex items-center gap-1 rounded-xl bg-destructive text-destructive-foreground px-3 py-1.5 hover:bg-destructive/95 transition-all font-semibold disabled:opacity-50"
              >
                <ArrowUpCircle className="h-3.5 w-3.5" />
                <span>Escalate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default CaseQueue;
