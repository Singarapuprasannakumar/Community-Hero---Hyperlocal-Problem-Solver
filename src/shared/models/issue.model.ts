import mongoose, { Schema } from "mongoose";

const LocationSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  accuracy: { type: Number },
  address: { type: String, required: true },
  landmark: { type: String },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const AttachmentSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
  uploadProgress: { type: Number },
  status: { type: String, required: true },
  exif: { type: Schema.Types.Mixed }
}, { _id: false });

const CommentReactionSchema = new Schema({
  emoji: { type: String, required: true },
  count: { type: Number, required: true },
  users: [{ type: String }]
}, { _id: false });

const IssueCommentSchema = new Schema({
  id: { type: String, required: true },
  issueId: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, required: true },
  authorAvatar: { type: String },
  content: { type: String, required: true },
  reactions: [CommentReactionSchema],
  pinned: { type: Boolean, default: false },
  edited: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  createdAt: { type: String, required: true },
  replies: [Schema.Types.Mixed],
  attachments: [AttachmentSchema]
}, { _id: false });

const TimelineEventSchema = new Schema({
  id: { type: String, required: true },
  issueId: { type: String, required: true },
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  actorName: { type: String, required: true },
  actorRole: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { _id: false });

const VerificationVoteSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  type: { type: String, required: true },
  evidenceNote: { type: String },
  createdAt: { type: String, required: true }
}, { _id: false });

const AIMetadataSchema = new Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  confidenceScore: { type: Number, required: true },
  severityScore: { type: Number, required: true },
  priorityScore: { type: Number, required: true },
  recommendedDepartment: { type: String, required: true },
  riskScore: { type: Number, required: true },
  duplicateGroupId: { type: String },
  etaHours: { type: Number, required: true },
  costEstimate: { type: Number, required: true },
  detectedObjects: [{ type: String }]
}, { _id: false });

const IssueSchema = new Schema({
  id: { type: String, required: true, unique: true },
  refNumber: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  tags: [{ type: String }],
  priority: { type: String, required: true },
  severity: { type: String, required: true },
  status: { type: String, required: true },
  
  location: { type: LocationSchema, required: true },
  
  reporterId: { type: String, required: true },
  reporterName: { type: String, required: true },
  reporterRole: { type: String, required: true },
  reporterReputation: { type: Number, required: true },
  reporterAvatar: { type: String },
  anonymous: { type: Boolean, default: false },

  assignedOfficerId: { type: String },
  assignedOfficerName: { type: String },
  assignedTeam: { type: String },
  department: { type: String },

  attachments: [AttachmentSchema],
  aiMetadata: { type: AIMetadataSchema },
  
  comments: [IssueCommentSchema],
  timeline: [TimelineEventSchema],
  verifications: [VerificationVoteSchema],

  duplicateGroupId: { type: String },
  relatedIssues: [{ type: String }],
  estimatedCost: { type: Number, default: 0 },
  estimatedResolutionHours: { type: Number, default: 0 },
  visibility: { type: String, required: true, default: "public" },

  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  resolvedAt: { type: String },
  closedAt: { type: String }
}, {
  versionKey: false,
});

export const IssueModel = mongoose.models.Issue || mongoose.model("Issue", IssueSchema);
