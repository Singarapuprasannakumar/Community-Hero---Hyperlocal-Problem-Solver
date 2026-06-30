export interface CopilotMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedCommands?: string[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: "assignment" | "duplicate" | "escalation" | "inspection";
  issueId: string;
  targetOfficerId?: string;
  targetOfficerName?: string;
  confidenceScore: number;
  status: "pending" | "applied" | "ignored";
  createdAt: string;
}

export interface HotspotZone {
  id: string;
  name: string;
  center: [number, number];
  radiusMeters: number;
  incidentCount: number;
  primaryCategory: string;
  riskScore: number; // 0-100
}

export interface AIModelStatus {
  name: string;
  status: "online" | "offline" | "loading";
  latencyMs: number;
  accuracy: number;
}
export interface InferenceItem {
  id: string;
  issueId: string;
  stageName: string;
  progressPercent: number;
  timestamp: string;
}
export interface SemanticQueryLog {
  query: string;
  intent: string;
  resultsCount: number;
  confidence: number;
  timestamp: string;
}
export interface VisionTag {
  label: string;
  confidence: number;
  box?: [number, number, number, number]; // x, y, width, height
}
export interface AIPipelineState {
  stage: string;
  progress: number;
}
