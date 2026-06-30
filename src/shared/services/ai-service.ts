import { simulateNetwork } from "./base-service";
import { AIMetadata } from "../types/issue-types";

export interface TriageStage {
  id: string;
  name: string;
}

export const TRIAGE_STAGES: TriageStage[] = [
  { id: "img", name: "Image Processing & Filtering" },
  { id: "obj", name: "Object Detection & Visual Isolation" },
  { id: "cat", name: "Category Classification" },
  { id: "sev", name: "Severity & Danger Prediction" },
  { id: "dup", name: "Spatial Duplicate Search" },
  { id: "dept", name: "Department Recommendation" },
  { id: "risk", name: "Public Risk Assessment" },
  { id: "eta", name: "Resolution ETA Calculation" },
  { id: "cost", name: "Cost Projection Model" },
  { id: "report", name: "Aggregating Final AI Report" },
];

export const aiService = {
  async runTriagePipeline(
    title: string,
    description: string,
    onStageChange: (stageIndex: number, stageName: string) => void
  ): Promise<AIMetadata> {
    // Run through the 10 stages sequentially
    for (let i = 0; i < TRIAGE_STAGES.length; i++) {
      onStageChange(i, TRIAGE_STAGES[i].name);
      // Wait between 300ms and 500ms per stage
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 300));
    }

    const text = (title + " " + description).toLowerCase();
    
    let category = "Roads & Transit";
    let subcategory = "Pothole";
    let dept = "BBMP - Roads";
    let eta = 36;
    let cost = 1200;
    let detectedObjects = ["Paved road", "Cavity", "Asphalt crack"];
    
    if (text.includes("leak") || text.includes("water") || text.includes("pipe") || text.includes("sewage")) {
      category = "Water Supply";
      subcategory = text.includes("pipe") ? "Pipe Burst" : "Water Leakage";
      dept = "BWSSB - Water Operations";
      eta = 18;
      cost = 4500;
      detectedObjects = ["Liquid flow", "Concrete pipe", "Erosion"];
    } else if (text.includes("trash") || text.includes("garbage") || text.includes("dump") || text.includes("waste")) {
      category = "Sanitation";
      subcategory = text.includes("dump") ? "Illegal Dumping" : "Garbage Pile";
      dept = "BBMP - Waste Management";
      eta = 12;
      cost = 750;
      detectedObjects = ["Refuse pile", "Plastic container", "Organic waste"];
    } else if (text.includes("tree") || text.includes("park") || text.includes("branch")) {
      category = "Parks & Trees";
      subcategory = text.includes("tree") ? "Fallen Tree" : "Park Damage";
      dept = "BBMP - Forest Department";
      eta = 24;
      cost = 1800;
      detectedObjects = ["Foliage", "Wood trunk", "Blockage"];
    } else if (text.includes("wire") || text.includes("electric") || text.includes("power") || text.includes("shock")) {
      category = "Hazards & Safety";
      subcategory = "Exposed Wires";
      dept = "BESCOM - Power Grid";
      eta = 8;
      cost = 2500;
      detectedObjects = ["Conductive wire", "Utility pole", "Hazard tag"];
    }

    const aiMetadata: AIMetadata = {
      category,
      subcategory,
      confidenceScore: parseFloat((Math.random() * 0.15 + 0.83).toFixed(2)), // 83% to 98%
      severityScore: text.includes("wire") || text.includes("burst") ? 4 : 2,
      priorityScore: text.includes("wire") || text.includes("burst") ? 4 : 2,
      recommendedDepartment: dept,
      riskScore: text.includes("wire") ? 92 : text.includes("burst") ? 78 : 45,
      etaHours: eta,
      costEstimate: cost,
      detectedObjects,
    };

    return simulateNetwork(aiMetadata, 0.0);
  }
};
