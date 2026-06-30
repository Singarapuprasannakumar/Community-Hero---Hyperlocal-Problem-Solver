import { useState } from "react";
import { MessageSquare, Pin, Check, Reply, Smile, Trash2 } from "lucide-react";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useIssueStore } from "@/shared/stores/issue-store";
import { IssueComment, CommentReaction } from "@/shared/types/issue-types";
import { UserRole } from "@/shared/types/user-types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CommentsSectionProps {
  issueId: string;
  comments: IssueComment[];
}

const ROLE_BADGES: Record<UserRole, string> = {
  citizen: "bg-blue-500/15 text-blue-500",
  volunteer: "bg-emerald-500/15 text-emerald-500",
  ngo: "bg-purple-500/15 text-purple-500",
  officer: "bg-amber-500/15 text-amber-500",
  manager: "bg-rose-500/15 text-rose-500",
  admin: "bg-foreground/10 text-foreground",
};

export function CommentsSection({ issueId, comments }: CommentsSectionProps) {
  const { user } = useAuthStore();
  const { addComment } = useIssueStore();
  const [commentText, setCommentText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    const newComment: IssueComment = {
      id: `com-${Math.random().toString(36).substr(2)}`,
      issueId,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content: commentText.trim(),
      reactions: [
        { emoji: "👍", count: 0, users: [] },
        { emoji: "❤️", count: 0, users: [] },
      ],
      pinned: false,
      edited: false,
      deleted: false,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    addComment(issueId, newComment);
    setCommentText("");
    toast.success("Comment posted successfully");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-bold flex items-center gap-1.5 border-b border-border pb-3">
        <MessageSquare className="h-5 w-5 text-primary" />
        <span>Discussion ({comments.length})</span>
      </h3>

      {/* Comment Form */}
      {user && (
        <form onSubmit={handlePostComment} className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 text-xs font-bold text-white uppercase">
            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 space-y-2">
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your note or mention someone (e.g. @Aarti)..."
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary resize-none"
            />
            <div className="flex justify-end">
              <button type="submit" className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:bg-primary/95 transition-all">
                Post Comment
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="relative flex gap-3.5 group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground uppercase">
              {comment.authorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 border border-border bg-card p-4 rounded-2xl shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold">{comment.authorName}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider", ROLE_BADGES[comment.authorRole])}>
                    {comment.authorRole}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground/80">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{comment.content}</p>

              {/* Actions & Reactions */}
              <div className="mt-4 flex items-center gap-3.5">
                <div className="flex gap-1.5">
                  {comment.reactions.map((react, idx) => (
                    <button
                      key={idx}
                      onClick={() => toast.info("Reaction triggers will be synchronized in a later update")}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/55 px-2 py-0.5 text-[10px] hover:bg-secondary transition-all"
                    >
                      <span>{react.emoji}</span>
                      <span>{react.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
