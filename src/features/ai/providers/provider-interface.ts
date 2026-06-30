import { CopilotMessage, VisionTag } from "../../../shared/types/ai-types";

export interface AIProvider {
  name: string;
  analyzeImage(imageUrl: string): Promise<VisionTag[]>;
  classifyIssue(title: string, desc: string): Promise<{
    category: string;
    subcategory: string;
    confidence: number;
    severityScore: number;
    recommendedDepartment: string;
    costEstimate: number;
    etaHours: number;
  }>;
  findDuplicates(
    lat: number,
    lng: number,
    category: string,
    desc: string
  ): Promise<{
    duplicateProbability: number;
    suggestedMergeId?: string;
    relatedIds: string[];
  }>;
  generateChatResponse(
    query: string,
    history: CopilotMessage[]
  ): Promise<{
    response: string;
    commandToExecute?: { type: string; params: any };
  }>;
}
