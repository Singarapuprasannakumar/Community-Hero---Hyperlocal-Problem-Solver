import { TimelineEvent, IssueStatus } from "@/shared/types/issue-types";
import { UserRole } from "@/shared/types/user-types";
import {
  Sparkles,
  MapPin,
  Camera,
  CheckCircle2,
  Users,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  RotateCcw,
  Ban,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
  timeline: TimelineEvent[];
}

const EVENT_ICONS: Record<string, any> = {
  submitted: Camera,
  ai_processing: Sparkles,
  pending_verification: Users,
  verified: ShieldCheck,
  assigned: UserCheck,
  accepted: CheckCircle2,
  in_progress: Wrench,
  resolved: CheckCircle2,
  closed: ShieldCheck,
  reopened: RotateCcw,
  cancelled: Ban,
};

const STATUS_TUNE: Record<string, string> = {
  submitted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ai_processing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  pending_verification: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  verified: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  assigned: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  in_progress: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  resolved: "bg-success/15 text-success border-success/30",
};

export function TimelineView({ timeline }: TimelineViewProps) {
  // Sort timeline events: newest first
  const sorted = [...timeline].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="relative pl-6 border-l border-border space-y-6">
      {sorted.map((event) => {
        const Icon = EVENT_ICONS[event.status] || Sparkles;
        const colorClass = STATUS_TUNE[event.status] || "bg-secondary text-foreground";
        return (
          <div key={event.id} className="relative group">
            {/* Timeline dot */}
            <span className={cn(
              "absolute -left-[35px] top-1 flex h-6.5 w-6.5 items-center justify-center rounded-full border bg-card shadow-soft transition-transform group-hover:scale-110",
              colorClass
            )}>
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-xs font-semibold text-foreground">{event.title}</h4>
                <span className="text-[10px] text-muted-foreground/85">
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-normal">
                {event.description}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-muted-foreground/75 font-semibold uppercase tracking-wider">
                <span>By: {event.actorName}</span>
                <span>•</span>
                <span>Role: {event.actorRole}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
