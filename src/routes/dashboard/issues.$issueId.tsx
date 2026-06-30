import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calendar,
  Sparkles,
  MapPin,
  Camera,
  FolderOpen,
  ArrowLeft,
  Users,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Building,
  HelpCircle,
  TrendingUp,
  Tag
} from "lucide-react";
import { useUIStore } from "@/shared/stores/ui-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useIssueStore } from "@/shared/stores/issue-store";
import { CommentsSection } from "@/features/issues/components/comments-section";
import { TimelineView } from "@/features/issues/components/timeline-view";
import { VerificationPanel } from "@/features/issues/components/verification-panel";
import { IssueStatus, TimelineEvent } from "@/shared/types/issue-types";
import { Reveal } from "@/lib/motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/issues/$issueId")({
  head: () => ({
    meta: [
      { title: "Incident Details — Community Hero AI" },
    ],
  }),
  component: IssueDetailsPage,
});

const STATUS_LABELS: Record<IssueStatus, { text: string; style: string }> = {
  draft: { text: "Draft", style: "bg-secondary text-foreground border-border" },
  submitted: { text: "Submitted", style: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  ai_processing: { text: "AI Processing", style: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  pending_verification: { text: "Pending Verification", style: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  verified: { text: "Verified", style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  assigned: { text: "Assigned", style: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  accepted: { text: "Accepted", style: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  in_progress: { text: "In Progress", style: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  waiting_for_materials: { text: "Waiting for Materials", style: "bg-stone-500/10 text-stone-500 border-stone-500/20" },
  escalated: { text: "Escalated", style: "bg-destructive/15 text-destructive border-destructive/20" },
  resolved: { text: "Resolved", style: "bg-success/15 text-success border-success/30" },
  rejected: { text: "Rejected", style: "bg-destructive/10 text-destructive border-destructive/10" },
  closed: { text: "Closed", style: "bg-foreground/10 text-foreground border-foreground/10" },
  reopened: { text: "Reopened", style: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  cancelled: { text: "Cancelled", style: "bg-secondary text-muted-foreground border-border" },
};

function IssueDetailsPage() {
  const { issueId } = useParams({ from: "/dashboard/issues/$issueId" });
  const { user } = useAuthStore();
  const { issues, updateIssue, addTimelineEvent, initializeDatabase } = useIssueStore();
  const { setBreadcrumbs } = useUIStore();

  const [activeTab, setActiveTab] = useState<"discussion" | "history">("discussion");

  // Ensure DB generated
  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  const issue = issues.find((i) => i.id === issueId || i.refNumber === issueId);

  useEffect(() => {
    if (issue) {
      setBreadcrumbs([
        { label: "Dashboard", to: "/dashboard" },
        { label: "Issues", to: "/dashboard/issues" },
        { label: issue.refNumber },
      ]);
    }
  }, [issue, setBreadcrumbs]);

  if (!issue) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <h3 className="mt-4 text-base font-semibold">Incident Record Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">
          The requested issue reference ID does not exist or has been deleted.
        </p>
        <Link to="/dashboard/issues" className="mt-6 text-xs text-primary font-semibold hover:underline">
          Go back to Issues board
        </Link>
      </div>
    );
  }

  // Operator workflow transitions
  const handleStatusChange = (newStatus: IssueStatus) => {
    if (!user) return;
    
    updateIssue(issue.id, { status: newStatus });
    
    const event: TimelineEvent = {
      id: `tml-stat-${Math.random().toString(36).substr(2)}`,
      issueId: issue.id,
      status: newStatus,
      title: `Status set to ${newStatus.replace("_", " ").toUpperCase()}`,
      description: `Government Operator ${user.name} transitioned progress state to ${newStatus.replace("_", " ")}.`,
      actorName: user.name,
      actorRole: user.role,
      createdAt: new Date().toISOString(),
    };
    
    addTimelineEvent(issue.id, event);
    toast.success(`Workflow status updated to ${newStatus.toUpperCase()}`);
  };

  const isOperator = user?.role === "officer" || user?.role === "manager" || user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Detail header */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/dashboard/issues" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Issues board
          </Link>
          <div className="flex items-center gap-2">
            <span className={cn(
              "inline-block rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
              STATUS_LABELS[issue.status]?.style || ""
            )}>
              {STATUS_LABELS[issue.status]?.text || issue.status}
            </span>
          </div>
        </div>
      </Reveal>

      {/* Main grids */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Reveal className="space-y-6">
          {/* Overview Panel */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                Ref: {issue.refNumber}
              </span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">{issue.title}</h1>
            </div>
            
            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
              {issue.description}
            </p>

            {/* Tags mapping */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {issue.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] text-muted-foreground font-medium">
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Reporter details */}
            <div className="flex items-center gap-3 border-t border-border pt-4 text-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold uppercase text-foreground">
                {issue.reporterName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold">{issue.anonymous ? "Anonymous Citizen" : issue.reporterName}</div>
                <div className="text-[10px] text-muted-foreground">Reputation Score: {issue.reporterReputation}%</div>
              </div>
            </div>
          </div>

          {/* Media Attachments */}
          {issue.attachments && issue.attachments.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
              <h3 className="font-semibold text-sm">Media & Attachments</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {issue.attachments.map((att) => (
                  <div key={att.id} className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
                    {att.type === "image" ? (
                      <img src={att.url} alt={att.name} className="h-32 w-full object-cover" />
                    ) : (
                      <div className="flex h-32 w-full flex-col items-center justify-center bg-secondary text-muted-foreground">
                        <FolderOpen className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        <span className="text-xs font-semibold">{att.name}</span>
                      </div>
                    )}
                    <div className="p-3 text-[11px] flex justify-between bg-card">
                      <span className="truncate max-w-[140px] font-medium">{att.name}</span>
                      <span className="text-muted-foreground">{(att.size / 1024).toFixed(0)}KB</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussion & History Tabs */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex gap-2 border-b border-border pb-3 mb-6">
              <button
                onClick={() => setActiveTab("discussion")}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                  activeTab === "discussion" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                )}
              >
                Discussion
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                  activeTab === "history" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                )}
              >
                History Timeline
              </button>
            </div>

            {activeTab === "discussion" ? (
              <CommentsSection issueId={issue.id} comments={issue.comments} />
            ) : (
              <TimelineView timeline={issue.timeline} />
            )}
          </div>
        </Reveal>

        <Reveal className="space-y-6">
          {/* Operator Triage Console */}
          {isOperator && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-1.5 border-b border-border pb-3">
                <UserCheck className="h-4.5 w-4.5 text-primary" />
                <span>Operator Triage Controls</span>
              </h3>
              <div className="space-y-2">
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase">Update Progress Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["pending_verification", "assigned", "in_progress", "resolved", "rejected", "closed"] as IssueStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={cn(
                        "rounded-xl border border-border bg-background py-2 text-center text-xs font-semibold transition-all hover:bg-secondary",
                        issue.status === st ? "border-primary bg-primary/5 text-primary" : ""
                      )}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Predictor Summary */}
          {issue.aiMetadata && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-1.5 border-b border-border pb-3">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <span>AI Prediction Analysis</span>
              </h3>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence Metric:</span>
                  <span className="font-semibold text-success">{Math.floor(issue.aiMetadata.confidenceScore * 100)}%</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Assigned Department:</span>
                  <span className="font-semibold">{issue.aiMetadata.recommendedDepartment}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Estimated SLA Cost:</span>
                  <span className="font-semibold">₹{issue.aiMetadata.costEstimate}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Resolution Window:</span>
                  <span className="font-semibold">{issue.aiMetadata.etaHours} Hours</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">AI Risk Parameters:</span>
                  <span className="font-semibold">{issue.aiMetadata.riskScore}/100</span>
                </div>
              </div>
            </div>
          )}

          {/* Verification Actions */}
          <VerificationPanel issueId={issue.id} verifications={issue.verifications} />

          {/* Location Panel */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5 border-b border-border pb-3">
              <MapPin className="h-4.5 w-4.5 text-primary" />
              <span>Location Context</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px]">Address</span>
                <span className="font-medium text-foreground">{issue.location.address}</span>
              </div>
              {issue.location.landmark && (
                <div className="border-t border-border pt-2">
                  <span className="text-muted-foreground block text-[10px]">Landmark</span>
                  <span className="font-medium text-foreground">{issue.location.landmark}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 border-t border-border pt-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground block text-[9px]">Latitude</span>
                  <span className="font-mono">{issue.location.latitude.toFixed(5)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[9px]">Longitude</span>
                  <span className="font-mono">{issue.location.longitude.toFixed(5)}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
