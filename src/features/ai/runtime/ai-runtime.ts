import { MockAIProvider } from "../providers/mock-provider";
import { AIProvider } from "../providers/provider-interface";
import { CopilotMessage } from "../../../shared/types/ai-types";

class AIRuntime {
  private activeProvider: AIProvider;

  constructor() {
    // Default to mock provider. Easily swappable to OpenAI or Gemini providers
    this.activeProvider = new MockAIProvider();
  }

  setProvider(provider: AIProvider) {
    this.activeProvider = provider;
  }

  getProviderName(): string {
    return this.activeProvider.name;
  }

  async runTriagePipeline(
    title: string,
    description: string,
    onProgress: (stageIndex: number, stageName: string) => void
  ) {
    const pipelineStages = [
      "Initializing AI Engine Runtime",
      "Scanning Media for Metadata EXIF tags",
      "Visual Feature Extraction",
      "Object Detection Isolation",
      "Category Classification Model",
      "Severity Class Prediction",
      "Duplicate Proximity Checks",
      "Department Recommendation Mapping",
      "Municipal Priority Allocation",
      "Infrastructure Risk Assessment",
      "Resolution SLA Window ETA",
      "Cost Model Projection",
      "Citizen Density Impact Ratio",
      "Compiling Final AI Assessment Report",
    ];

    for (let i = 0; i < pipelineStages.length; i++) {
      onProgress(i, pipelineStages[i]);
      // Simulated progressive inference delays
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 150 + 200));
    }

    return this.activeProvider.classifyIssue(title, description);
  }

  async findDuplicates(lat: number, lng: number, category: string, desc: string) {
    return this.activeProvider.findDuplicates(lat, lng, category, desc);
  }

  async handleCopilotQuery(query: string, history: CopilotMessage[]) {
    return this.activeProvider.generateChatResponse(query, history);
  }
}

export const aiRuntime = new AIRuntime();
export default aiRuntime;
