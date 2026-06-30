import { UserRole } from "./user-types";

export type IssueStatus =
  | "draft"
  | "submitted"
  | "ai_processing"
  | "pending_verification"
  | "verified"
  | "assigned"
  | "accepted"
  | "in_progress"
  | "waiting_for_materials"
  | "escalated"
  | "resolved"
  | "rejected"
  | "closed"
  | "reopened"
  | "cancelled";

export type IssuePriority = "low" | "medium" | "high" | "urgent";
export type IssueSeverity = "low" | "medium" | "high" | "critical";

export interface ExifMetadata {
  make?: string;
  model?: string;
  dateTime?: string;
  exposureTime?: string;
  fNumber?: number;
  isoSpeedRatings?: number;
  gpsLatitude?: number;
  gpsLongitude?: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: "image" | "video" | "voice" | "pdf" | "document";
  url: string;
  size: number;
  uploadProgress?: number; // 0 to 100
  status: "uploading" | "completed" | "failed";
  exif?: ExifMetadata;
}

export interface TimelineEvent {
  id: string;
  issueId: string;
  status: IssueStatus;
  title: string;
  description: string;
  actorName: string;
  actorRole: UserRole | "system";
  createdAt: string;
}

export interface CommentReaction {
  emoji: string;
  count: number;
  users: string[]; // List of userIds
}

export interface IssueComment {
  id: string;
  issueId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  content: string;
  reactions: CommentReaction[];
  pinned: boolean;
  edited: boolean;
  deleted: boolean;
  createdAt: string;
  replies?: IssueComment[];
  attachments?: Attachment[];
}

export interface VerificationVote {
  id: string;
  userId: string;
  userName: string;
  type: "upvote" | "downvote" | "duplicate" | "spam";
  evidenceNote?: string;
  createdAt: string;
}

export interface AIMetadata {
  category: string;
  subcategory: string;
  confidenceScore: number; // 0.0 to 1.0
  severityScore: number;
  priorityScore: number;
  recommendedDepartment: string;
  riskScore: number;
  duplicateGroupId?: string;
  etaHours: number;
  costEstimate: number;
  detectedObjects: string[];
}

export interface LocationObject {
  latitude: number;
  longitude: number;
  accuracy?: number; // in meters
  address: string;
  landmark?: string;
  ward: string;
  district: string;
  city: string;
  state: string;
  country: string;
}

export interface Issue {
  id: string;
  refNumber: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  priority: IssuePriority;
  severity: IssueSeverity;
  status: IssueStatus;
  
  // Location
  location: LocationObject;
  
  // Actor context
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  reporterReputation: number;
  reporterAvatar?: string;
  anonymous: boolean;

  // Assignment
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedTeam?: string;
  department?: string;

  // Media
  attachments: Attachment[];
  
  // AI Metrics
  aiMetadata?: AIMetadata;
  
  // Actions
  comments: IssueComment[];
  timeline: TimelineEvent[];
  verifications: VerificationVote[];

  // Meta stats
  duplicateGroupId?: string;
  relatedIssues: string[]; // list of issueIds
  estimatedCost: number;
  estimatedResolutionHours: number;
  visibility: "public" | "private";

  // Timestamps
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}
