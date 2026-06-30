import { UserRole } from "../types/user-types";

export interface VolunteerProfile {
  id: string;
  name: string;
  skills: string[];
  interests: string[];
  availability: "flexible" | "weekends" | "nights" | "emergency_only";
  serviceRadiusKm: number;
  completedTasksCount: number;
  volunteerHours: number;
  impactScore: number; // 0-100
  volunteerScore: number;
  preferredCategories: string[];
}

export interface Organization {
  id: string;
  name: string;
  type: "ngo" | "rwa" | "csr" | "college" | "government";
  memberCount: number;
  campaignsCount: number;
  projectsCompleted: number;
  reputation: number;
  logo?: string;
  description: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: "cleanup" | "planting" | "blood" | "traffic" | "flood" | "health";
  goalDescription: string;
  participantCount: number;
  progressPercent: number;
  status: "active" | "completed" | "planned";
  impactMetric: string;
  createdAt: string;
}

export interface VolunteerTask {
  id: string;
  issueId: string;
  title: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "verified";
  evidenceNote?: string;
  evidenceUrl?: string;
  hoursSpent?: number;
  completedAt?: string;
}

export interface CommunityEvent {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  locationAddress: string;
  lat: number;
  lng: number;
  eventDate: string;
  registrantCount: number;
  attendeeCount: number;
  volunteersNeeded: number;
  status: "scheduled" | "active" | "completed";
}

export interface FeedPost {
  id: string;
  title: string;
  description: string;
  type: "issue_resolved" | "campaign_started" | "tree_planted" | "announcement" | "milestone" | "emergency";
  authorName: string;
  authorRole: UserRole | "system" | "rwa";
  likesCount: number;
  commentsCount: number;
  likedBy: string[]; // List of userIds
  image?: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  role: UserRole;
  rank: number;
  xp: number;
  badgesCount: number;
  trustScore: number;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface UserReputation {
  userId: string;
  trustScore: number; // 0-100
  communityScore: number; // XP based
  volunteerScore: number;
  verificationAccuracy: number; // percentage
  activityScore: number;
}
