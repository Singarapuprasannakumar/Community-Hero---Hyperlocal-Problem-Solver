import { AIProvider } from "./provider-interface";
import { VisionTag, CopilotMessage } from "../../../shared/types/ai-types";

export class MockAIProvider implements AIProvider {
  name = "Mock AI Engine (Fallback)";

  async analyzeImage(imageUrl: string): Promise<VisionTag[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [
      { label: "Road pothole", confidence: 0.94, box: [100, 200, 150, 150] },
      { label: "Asphalt crack", confidence: 0.82 },
      { label: "Cavity depth: 12cm", confidence: 0.78 },
    ];
  }

  async classifyIssue(title: string, desc: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const text = (title + " " + desc).toLowerCase();
    
    let category = "Roads & Transit";
    let subcategory = "Pothole";
    let dept = "BBMP - Roads";
    let cost = 1200;
    let eta = 36;
    
    if (text.includes("leak") || text.includes("water") || text.includes("pipe") || text.includes("sewage")) {
      category = "Water Supply";
      subcategory = "Pipe Burst";
      dept = "BWSSB - Water Operations";
      cost = 4500;
      eta = 18;
    } else if (text.includes("trash") || text.includes("garbage") || text.includes("dump") || text.includes("waste")) {
      category = "Sanitation";
      subcategory = "Illegal Dumping";
      dept = "BBMP - Waste Management";
      cost = 750;
      eta = 12;
    } else if (text.includes("tree") || text.includes("park") || text.includes("branch")) {
      category = "Parks & Trees";
      subcategory = "Fallen Tree";
      dept = "BBMP - Forest Department";
      cost = 1800;
      eta = 24;
    } else if (text.includes("wire") || text.includes("electric") || text.includes("power") || text.includes("shock")) {
      category = "Hazards & Safety";
      subcategory = "Exposed Wires";
      dept = "BESCOM - Power Grid";
      cost = 2500;
      eta = 8;
    }

    return {
      category,
      subcategory,
      confidence: 0.91,
      severityScore: text.includes("wire") || text.includes("burst") ? 4 : 2,
      recommendedDepartment: dept,
      costEstimate: cost,
      etaHours: eta,
    };
  }

  async findDuplicates(lat: number, lng: number, category: string, desc: string) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const isDuplicate = desc.toLowerCase().includes("duplicate") || desc.toLowerCase().includes("re-report");
    
    return {
      duplicateProbability: isDuplicate ? 0.94 : 0.05,
      suggestedMergeId: isDuplicate ? "iss-1" : undefined,
      relatedIds: isDuplicate ? ["iss-1"] : [],
    };
  }

  async generateChatResponse(query: string, history: CopilotMessage[]) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const q = query.toLowerCase();
    
    // Command Parser Hooks
    if (q.includes("road") || q.includes("pothole")) {
      return {
        response: "Filtering active view map layers to show all Road and Transit incidents.",
        commandToExecute: { type: "FILTER_CATEGORY", params: { category: "Roads & Transit" } },
      };
    }
    
    if (q.includes("water") || q.includes("leak")) {
      return {
        response: "Filtering map layers to highlight water outages and burst pipe incidents.",
        commandToExecute: { type: "FILTER_CATEGORY", params: { category: "Water Supply" } },
      };
    }

    if (q.includes("critical") || q.includes("urgent")) {
      return {
        response: "Filtering dashboard list to isolate critical and urgent priority reports.",
        commandToExecute: { type: "FILTER_PRIORITY", params: { priority: "urgent" } },
      };
    }

    if (q.includes("clear") || q.includes("reset")) {
      return {
        response: "Clearing all filters, active dispatches, and resetting the map layout viewport.",
        commandToExecute: { type: "RESET_VIEW", params: {} },
      };
    }

    // Default conversational response
    return {
      response: "I can help search incidents, route dispatches, and overlay AI hotspot layers. Try asking me to 'filter to critical issues' or 'show road reports'!",
    };
  }
}
export default MockAIProvider;
