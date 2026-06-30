import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Issue, IssueStatus, IssuePriority, IssueSeverity, IssueComment, VerificationVote, TimelineEvent } from "../types/issue-types";
import { issueService } from "../services/issue-service";

interface IssueState {
  issues: Issue[];
  drafts: Partial<Issue>[];
  activeDraft: Partial<Issue> | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeDatabase: () => void;
  loadIssues: () => Promise<void>;
  refreshIssues: () => Promise<void>;
  createIssue: (issue: Issue) => Promise<void>;
  updateIssue: (id: string, updates: Partial<Issue>) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  
  // Drafts
  saveDraft: (draft: Partial<Issue>) => void;
  deleteDraft: (id: string) => void;
  setActiveDraft: (draft: Partial<Issue> | null) => void;
  
  // Interactions
  addComment: (issueId: string, comment: IssueComment) => void;
  addVerification: (issueId: string, vote: VerificationVote) => void;
  addTimelineEvent: (issueId: string, event: TimelineEvent) => void;
}

export const useIssueStore = create<IssueState>()(
  persist(
    (set, get) => ({
      issues: [],
      drafts: [],
      activeDraft: null,
      isLoading: true,
      error: null,

      // Load real issues from backend
      loadIssues: async () => {
        set({ isLoading: true, error: null });
        try {
          const issues = await issueService.getAllIssues();
          set({ issues, isLoading: false });
        } catch (err: any) {
          set({ error: err.message || "Failed to load issues", isLoading: false });
        }
      },
      // Refresh issues (re-fetch from backend)
      refreshIssues: async () => {
        await get().loadIssues();
      },
      // Initialize database – call loadIssues once
      initializeDatabase: () => {
        // If issues already loaded, do nothing
        const current = get().issues;
        if (current && current.length > 0) {
          set({ isLoading: false });
          return;
        }
        // Fire‑and‑forget async load (state will be updated when promise resolves)
        get().loadIssues();
      },
      // Create issue via backend then prepend to state
      createIssue: async (issue) => {
        try {
          const created = await issueService.createIssue(issue);
          set((state) => ({ issues: [created, ...state.issues] }));
        } catch (err: any) {
          set({ error: err.message || "Failed to create issue" });
        }
      },
      // Update issue via backend then update state
      updateIssue: async (id, updates) => {
        try {
          const updated = await issueService.updateIssue(id, updates);
          set((state) => ({
            issues: state.issues.map((it) => (it.id === id ? { ...it, ...updated } : it)),
          }));
        } catch (err: any) {
          set({ error: err.message || "Failed to update issue" });
        }
      },
      // Delete issue, backend call, then refresh state
      deleteIssue: async (id) => {
        try {
          await issueService.deleteIssue(id);
          // After successful deletion, re‑load all issues to keep store in sync with backend and trigger UI refreshes
          await get().loadIssues();
        } catch (err: any) {
          set({ error: err.message || "Failed to delete issue" });
          throw err;
        }
      },

      saveDraft: (draft) =>
        set((state) => {
          const exists = state.drafts.find((d) => d.id === draft.id);
          const updatedDrafts = exists
            ? state.drafts.map((d) => (d.id === draft.id ? { ...d, ...draft } : d))
            : [...state.drafts, draft];
          return { drafts: updatedDrafts };
        }),

      deleteDraft: (id) =>
        set((state) => ({
          drafts: state.drafts.filter((d) => d.id !== id),
        })),

      setActiveDraft: (draft) => set({ activeDraft: draft }),

      addComment: (issueId, comment) =>
        set((state) => ({
          issues: state.issues.map((item) => {
            if (item.id !== issueId) return item;
            
            // Add timeline event automatically for comments
            const timelineEvent: TimelineEvent = {
              id: `tml-com-${Math.random().toString(36).substr(2)}`,
              issueId,
              status: item.status,
              title: "Comment Added",
              description: `${comment.authorName} (${comment.authorRole.toUpperCase()}) added a comment.`,
              actorName: comment.authorName,
              actorRole: comment.authorRole,
              createdAt: new Date().toISOString(),
            };

            return {
              ...item,
              comments: [...item.comments, comment],
              timeline: [...item.timeline, timelineEvent],
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      addVerification: (issueId, vote) =>
        set((state) => ({
          issues: state.issues.map((item) => {
            if (item.id !== issueId) return item;
            
            // Check if user already verified
            const alreadyVoted = item.verifications.some((v) => v.userId === vote.userId);
            if (alreadyVoted) return item;

            // Generate timeline log automatically for verifications
            const timelineEvent: TimelineEvent = {
              id: `tml-ver-${Math.random().toString(36).substr(2)}`,
              issueId,
              status: item.status,
              title: "Community Verified",
              description: `Volunteer ${vote.userName} verified the incident details on-site.`,
              actorName: vote.userName,
              actorRole: "volunteer",
              createdAt: new Date().toISOString(),
            };

            return {
              ...item,
              verifications: [...item.verifications, vote],
              timeline: [...item.timeline, timelineEvent],
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      addTimelineEvent: (issueId, event) =>
        set((state) => ({
          issues: state.issues.map((item) =>
            item.id === issueId
              ? {
                  ...item,
                  timeline: [...item.timeline, event],
                  updatedAt: new Date().toISOString(),
                }
              : item
          ),
        })),
    }),
    {
      name: "community-hero-issue-storage",
      partialize: (state) => ({
        drafts: state.drafts,
        activeDraft: state.activeDraft,
      }),
    }
  )
);
