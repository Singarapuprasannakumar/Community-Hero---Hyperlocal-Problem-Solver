import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VolunteerProfile, Organization, Campaign, VolunteerTask, CommunityEvent, FeedPost, LeaderboardEntry, DirectMessage, UserReputation } from "../types/community-types";

// ==========================================
// 1. VOLUNTEER STORE
// ==========================================
interface VolunteerState {
  volunteers: VolunteerProfile[];
  tasks: VolunteerTask[];
  acceptTask: (taskId: string, volunteerId: string, volunteerName: string) => void;
  completeTask: (taskId: string, evidenceNote: string) => void;
}

const mockVolunteers: VolunteerProfile[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `vol-prof-${i + 1}`,
  name: `Volunteer Expert ${i + 1}`,
  skills: ["First Aid", "Road clearing", "Tree planting", "Logistics"],
  interests: ["Environment", "Disaster relief", "Safety"],
  availability: "weekends",
  serviceRadiusKm: 5,
  completedTasksCount: i * 2,
  volunteerHours: i * 4,
  impactScore: 70 + i,
  volunteerScore: 100 + i * 5,
  preferredCategories: ["Roads & Transit", "Sanitation"],
}));

export const useVolunteerStore = create<VolunteerState>((set) => ({
  volunteers: mockVolunteers,
  tasks: [
    { id: "task-1", issueId: "iss-1", title: "Pothole marking Indiranagar", status: "pending" },
    { id: "task-2", issueId: "iss-2", title: "Drain cleaning Whitefield", status: "pending" },
  ],
  acceptTask: (taskId, volunteerId, volunteerName) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: "accepted", assignedVolunteerId: volunteerId, assignedVolunteerName: volunteerName }
          : t
      ),
    })),
  completeTask: (taskId, note) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: "completed", evidenceNote: note, completedAt: new Date().toISOString() }
          : t
      ),
    })),
}));

// ==========================================
// 2. ORGANIZATION STORE
// ==========================================
interface OrganizationState {
  organizations: Organization[];
  inviteMember: (orgId: string, email: string) => void;
}

const mockOrganizations: Organization[] = [
  { id: "org-1", name: "Indiranagar RWA Association", type: "rwa", memberCount: 120, campaignsCount: 8, projectsCompleted: 14, reputation: 92, description: "Active resident welfare association driving clean streets initiative." },
  { id: "org-2", name: "Clean Green Bengaluru NGO", type: "ngo", memberCount: 450, campaignsCount: 22, projectsCompleted: 45, reputation: 96, description: "Non-profit organization advocating for urban forestry and parks renewal." },
  { id: "org-3", name: "CSR Tech Care", type: "csr", memberCount: 75, campaignsCount: 3, projectsCompleted: 5, reputation: 84, description: "Corporate social responsibility volunteers mapping live road hazards." }
];

export const useOrganizationStore = create<OrganizationState>((set) => ({
  organizations: mockOrganizations,
  inviteMember: (orgId, email) => {
    set((state) => ({
      organizations: state.organizations.map((org) =>
        org.id === orgId ? { ...org, memberCount: org.memberCount + 1 } : org
      ),
    }));
  },
}));

// ==========================================
// 3. GAMIFICATION STORE
// ==========================================
interface GamificationState {
  xp: number;
  level: number;
  badges: string[];
  addXP: (amount: number) => void;
  unlockBadge: (badgeName: string) => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      xp: 420,
      level: 3,
      badges: ["First Report", "Verified Helper"],
      addXP: (amount) =>
        set((state) => {
          const nextXp = state.xp + amount;
          const nextLevel = Math.floor(nextXp / 500) + 1;
          return { xp: nextXp, level: nextLevel };
        }),
      unlockBadge: (badge) =>
        set((state) => ({
          badges: state.badges.includes(badge) ? state.badges : [...state.badges, badge],
        })),
    }),
    { name: "community-hero-gamification" }
  )
);

// ==========================================
// 4. LEADERBOARD STORE
// ==========================================
interface LeaderboardState {
  rankings: LeaderboardEntry[];
  updateRanks: () => void;
}

const mockRankings: LeaderboardEntry[] = [
  { userId: "user-1", name: "Ananya Sharma", role: "citizen", rank: 1, xp: 2450, badgesCount: 8, trustScore: 94 },
  { userId: "user-2", name: "Karan Patel", role: "citizen", rank: 2, xp: 1980, badgesCount: 6, trustScore: 88 },
  { userId: "user-3", name: "Rohan Das", role: "citizen", rank: 3, xp: 1650, badgesCount: 5, trustScore: 92 },
  { userId: "vol-1", name: "Volunteer Helper", role: "volunteer", rank: 4, xp: 1200, badgesCount: 4, trustScore: 85 },
];

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  rankings: mockRankings,
  updateRanks: () => {},
}));

// ==========================================
// 5. EVENT STORE
// ==========================================
interface EventState {
  events: CommunityEvent[];
  registerForEvent: (eventId: string) => void;
}

const mockEvents: CommunityEvent[] = [
  { id: "evt-1", campaignId: "camp-1", title: "Indiranagar Park Cleanup Drive", description: "Trash collection, brush clearing and playground painting.", locationAddress: "Indiranagar Main Park, Ward 80", lat: 12.978, lng: 77.640, eventDate: new Date(Date.now() + 86400000 * 3).toISOString(), registrantCount: 18, attendeeCount: 0, volunteersNeeded: 30, status: "scheduled" },
  { id: "evt-2", campaignId: "camp-2", title: "Bellandur Tree Plantation Camp", description: "Planting native tree saplings along the outer ring bypass.", locationAddress: "Bellandur Lake Road, Ward 150", lat: 12.925, lng: 77.670, eventDate: new Date(Date.now() + 86400000 * 5).toISOString(), registrantCount: 24, attendeeCount: 0, volunteersNeeded: 50, status: "scheduled" }
];

export const useEventStore = create<EventState>((set) => ({
  events: mockEvents,
  registerForEvent: (eventId) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId ? { ...e, registrantCount: e.registrantCount + 1 } : e
      ),
    })),
}));

// ==========================================
// 6. MESSAGING STORE
// ==========================================
interface MessagingState {
  messages: DirectMessage[];
  sendMessage: (senderId: string, senderName: string, text: string) => void;
}

export const useMessagingStore = create<MessagingState>((set) => ({
  messages: [
    { id: "msg-1", senderId: "vol-1", senderName: "Volunteer Helper", senderRole: "volunteer", text: "Are there any active road issues needing verification in Indiranagar?", timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
    { id: "msg-2", senderId: "user-1", senderName: "Ananya Sharma", senderRole: "citizen", text: "Yes, reported a streetlight outage on Residency Road", timestamp: new Date().toISOString(), read: false }
  ],
  sendMessage: (senderId, senderName, text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `msg-${Math.random().toString(36).substr(2)}`,
          senderId,
          senderName,
          senderRole: "citizen",
          text,
          timestamp: new Date().toISOString(),
          read: false,
        }
      ],
    })),
}));

// ==========================================
// 7. REPUTATION STORE
// ==========================================
interface ReputationState {
  reputation: UserReputation;
  updateTrustScore: (delta: number) => void;
}

export const useReputationStore = create<ReputationState>()(
  persist(
    (set) => ({
      reputation: {
        userId: "current-user",
        trustScore: 84,
        communityScore: 420,
        volunteerScore: 120,
        verificationAccuracy: 91,
        activityScore: 78,
      },
      updateTrustScore: (delta) =>
        set((state) => ({
          reputation: {
            ...state.reputation,
            trustScore: Math.min(100, Math.max(0, state.reputation.trustScore + delta)),
          },
        })),
    }),
    { name: "community-hero-reputation" }
  )
);

// ==========================================
// 8. COMMUNITY STORE (FEED)
// ==========================================
interface CommunityFeedState {
  feed: FeedPost[];
  addPost: (post: FeedPost) => void;
  likePost: (postId: string, userId: string) => void;
}

const mockFeed: FeedPost[] = [
  { id: "feed-1", title: "Residency Road Streetlight Restored!", description: "AI verification matched light restoration work complete. Thanks to RWA team.", type: "issue_resolved", authorName: "Indiranagar RWA", authorRole: "rwa", likesCount: 14, commentsCount: 2, likedBy: [], image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "feed-2", title: "Bellandur Tree Plantation Campaign", description: "Clean Green NGO launched a tree planting campaign. Registration open.", type: "campaign_started", authorName: "Clean Green NGO", authorRole: "ngo", likesCount: 22, commentsCount: 5, likedBy: [], createdAt: new Date(Date.now() - 3600000 * 8).toISOString() }
];

export const useCommunityStore = create<CommunityFeedState>((set) => ({
  feed: mockFeed,
  addPost: (post) => set((state) => ({ feed: [post, ...state.feed] })),
  likePost: (postId, userId) =>
    set((state) => ({
      feed: state.feed.map((post) => {
        if (post.id !== postId) return post;
        const alreadyLiked = post.likedBy.includes(userId);
        return {
          ...post,
          likesCount: alreadyLiked ? post.likesCount - 1 : post.likesCount + 1,
          likedBy: alreadyLiked ? post.likedBy.filter((id) => id !== userId) : [...post.likedBy, userId],
        };
      }),
    })),
}));
