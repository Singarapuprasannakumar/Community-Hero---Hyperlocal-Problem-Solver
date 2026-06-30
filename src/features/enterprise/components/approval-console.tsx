import { useApprovalStore } from "@/shared/stores/enterprise-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { Check, X, ShieldCheck, DollarSign } from "lucide-react";
import { toast } from "sonner";

export function ApprovalConsole() {
  const { user } = useAuthStore();
  const { approvals, approveRequest, rejectRequest } = useApprovalStore();

  const handleAction = (id: string, refNum: string, type: string, action: "approve" | "reject") => {
    if (!user) return;
    if (action === "approve") {
      approveRequest(id, user.name, "Authorized via Operations Center");
      toast.success(`Request for ${refNum} approved.`);
    } else {
      rejectRequest(id, user.name, "Denied via Operations Center");
      toast.error(`Request for ${refNum} rejected.`);
    }
  };

  const pendingApprovals = approvals.filter((a) => a.status === "pending");

  if (pendingApprovals.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-5 text-center text-xs text-muted-foreground shadow-soft">
        <ShieldCheck className="h-6 w-6 text-success mx-auto mb-2" />
        No pending operations or budget approvals at this time.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <DollarSign className="h-4.5 w-4.5 text-primary" />
        <span>Pending Approvals Console</span>
      </h3>
      <div className="space-y-4">
        {pendingApprovals.map((app) => (
          <div key={app.id} className="border border-border bg-secondary/15 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-foreground block">{app.title}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  Requester: <span className="font-semibold text-foreground">{app.requesterName}</span>
                </span>
              </div>
              <span className="text-[10px] font-semibold text-primary uppercase bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                {app.requestType}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{app.requestDetails}</p>

            {app.amount && (
              <div className="text-[11px] font-bold text-foreground bg-secondary/50 px-2 py-1 rounded-lg w-max">
                Estimate: ₹{app.amount.toLocaleString()}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <button
                onClick={() => handleAction(app.id, app.refNumber, app.requestType, "reject")}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3.5 py-1.5 hover:bg-secondary transition-all font-semibold text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
                <span>Deny</span>
              </button>
              <button
                onClick={() => handleAction(app.id, app.refNumber, app.requestType, "approve")}
                className="inline-flex items-center gap-1 rounded-xl bg-primary text-primary-foreground px-3.5 py-1.5 hover:bg-primary/95 transition-all font-semibold shadow-glow"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Approve</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ApprovalConsole;
