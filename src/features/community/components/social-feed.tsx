import { useState } from "react";
import { ThumbsUp, MessageSquare, Megaphone, Send, Award, Heart } from "lucide-react";
import { useCommunityStore } from "@/shared/stores/community-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { FeedPost } from "@/shared/types/community-types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SocialFeed() {
  const { user } = useAuthStore();
  const { feed, addPost, likePost } = useCommunityStore();
  
  const [postTitle, setPostTitle] = useState("");
  const [postDesc, setPostDesc] = useState("");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !postTitle.trim() || !postDesc.trim()) return;

    const newPost: FeedPost = {
      id: `feed-act-${Math.random().toString(36).substr(2)}`,
      title: postTitle.trim(),
      description: postDesc.trim(),
      type: "announcement",
      authorName: user.name,
      authorRole: user.role,
      likesCount: 0,
      commentsCount: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    };

    addPost(newPost);
    setPostTitle("");
    setPostDesc("");
    toast.success("Community announcement posted!");
  };

  return (
    <div className="space-y-6">
      {/* Create announcement card */}
      {user && (
        <form onSubmit={handleCreatePost} className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-3">
          <h3 className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
            <Megaphone className="h-4 w-4 text-primary" />
            <span>Publish Civic Announcement</span>
          </h3>
          <div className="space-y-2">
            <input
              type="text"
              required
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Post subject (e.g. Ward cleanup next Saturday)"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
            />
            <textarea
              rows={2}
              required
              value={postDesc}
              onChange={(e) => setPostDesc(e.target.value)}
              placeholder="What details would you like to share with the neighborhood?"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:bg-primary/95 transition-all">
              Post Feed
            </button>
          </div>
        </form>
      )}

      {/* Feed list */}
      <div className="space-y-4">
        {feed.map((post) => (
          <div key={post.id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            {post.image && (
              <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
            )}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground/80">
                <span className="font-semibold uppercase">{post.type.replace("_", " ")}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{post.title}</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{post.description}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                <span className="text-muted-foreground text-[10px]">
                  By: <span className="font-semibold text-foreground">{post.authorName}</span> ({post.authorRole})
                </span>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => user && likePost(post.id, user.id)}
                    className="inline-flex items-center gap-1 hover:text-primary transition-colors text-[11px]"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{post.likesCount} Likes</span>
                  </button>
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{post.commentsCount} Comments</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default SocialFeed;
