import { useState } from "react";
import { ShieldCheck, Check, AlertTriangle, HelpCircle, Users } from "lucide-react";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useIssueStore } from "@/shared/stores/issue-store";
import { VerificationVote } from "@/shared/types/issue-types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VerificationPanelProps {
  issueId: string;
  verifications: VerificationVote[];
}

export function VerificationPanel({ issueId, verifications }: VerificationPanelProps) {
  const { user } = useAuthStore();
  const { addVerification } = useIssueStore();
  const [evidence, setEvidence] = useState("");
  const [voted, setVoted] = useState(false);

  const userVote = user ? verifications.find((v) => v.userId === user.id) : null;
  const count = verifications.filter((v) => v.type === "upvote").length;

  const handleVote = (type: "upvote" | "duplicate" | "spam") => {
    if (!user) {
      toast.error("Please login to verify issues");
      return;
    }
    
    if (userVote || voted) {
      toast.info("You have already submitted verification details for this report.");
      return;
    }

    const newVote: VerificationVote = {
      id: `ver-act-${Math.random().toString(36).substr(2)}`,
      userId: user.id,
      userName: user.name,
      type,
      evidenceNote: evidence.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    addVerification(issueId, newVote);
    setVoted(true);
    setEvidence("");
    toast.success(`Verification vote '${type.toUpperCase()}' registered successfully.`);
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
      <h3 className="text-sm font-bold flex items-center gap-1.5 border-b border-border pb-3">
        <Users className="h-4.5 w-4.5 text-primary" />
        <span>Community Verification</span>
      </h3>

      <div className="flex items-center justify-between py-1 bg-secondary/35 px-3 rounded-xl text-xs">
        <span className="text-muted-foreground">Verification Count:</span>
        <span className="font-semibold">{count} Votes</span>
      </div>

      <p className="text-[11px] text-muted-foreground leading-normal">
        Help departments prioritize. Verify if this issue is valid, present, and has accurate coordinates.
      </p>

      {user && !userVote && !voted ? (
        <div className="space-y-3 pt-2">
          <textarea
            rows={2}
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Add comments or evidence note (optional)..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-[11px] outline-none focus:ring-1 focus:ring-primary resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleVote("upvote")}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-success px-3 py-2 text-xs font-semibold text-success-foreground hover:bg-success/95 transition-all"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Confirm</span>
            </button>
            <button
              onClick={() => handleVote("duplicate")}
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-secondary text-muted-foreground hover:text-foreground"
              title="Mark as duplicate"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-success/10 border border-success/20 p-3 text-xs text-success">
          <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
          <span>You have verified this incident report.</span>
        </div>
      )}
    </div>
  );
}
