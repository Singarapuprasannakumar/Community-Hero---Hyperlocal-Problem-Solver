import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CopilotMessage, AIRecommendation, HotspotZone, AIModelStatus } from "../types/ai-types";
import { aiRuntime } from "../../features/ai/runtime/ai-runtime";
import { useGISStore } from "./gis-store";
import { useIssueStore } from "./issue-store";

interface AIState {
  chatHistory: CopilotMessage[];
  recommendations: AIRecommendation[];
  hotspots: HotspotZone[];
  models: AIModelStatus[];
  isLoading: boolean;

  // Actions
  initializeAIStore: () => void;
  sendCopilotQuery: (text: string) => Promise<void>;
  applyRecommendation: (id: string) => void;
  clearChat: () => void;
}

const mockRecommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    title: "Merge duplicate reports in Ward 80",
    description: "AI identified pothole reports REF-4001 and REF-4005 share identical coordinate matches. Probability: 94%.",
    category: "duplicate",
    issueId: "iss-1",
    confidenceScore: 0.94,
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rec-2",
    title: "Escalate overdue Water Leakage ticket",
    description: "SLA window for pipe repair in Ward 150 has exceeded 18 hours. Recommend escalating priority to Urgent.",
    category: "escalation",
    issueId: "iss-2",
    confidenceScore: 0.88,
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rec-3",
    title: "Assign nearby Officer: Ramesh Kumar",
    description: "Ramesh Kumar is currently within 400m of the reported water pressure drop. Estimated travel: 4 mins.",
    category: "assignment",
    issueId: "iss-2",
    targetOfficerId: "off-2",
    targetOfficerName: "Ramesh Kumar",
    confidenceScore: 0.95,
    status: "pending",
    createdAt: new Date().toISOString(),
  }
];

const mockHotspots: HotspotZone[] = [
  {
    id: "hot-1",
    name: "Indiranagar Pothole Cluster",
    center: [12.978, 77.640],
    radiusMeters: 250,
    incidentCount: 12,
    primaryCategory: "Roads & Transit",
    riskScore: 78,
  },
  {
    id: "hot-2",
    name: "Bellandur Water Pipeline Leakages",
    center: [12.925, 77.670],
    radiusMeters: 400,
    incidentCount: 8,
    primaryCategory: "Water Supply",
    riskScore: 84,
  }
];

const initialModels: AIModelStatus[] = [
  { name: "Vision Classifiers v3.1", status: "online", latencyMs: 140, accuracy: 0.94 },
  { name: "Spatial Duplicate Clusterer", status: "online", latencyMs: 65, accuracy: 0.96 },
  { name: "SLA Cost/ETA Regressor", status: "online", latencyMs: 90, accuracy: 0.91 },
];

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      chatHistory: [
        {
          id: "welcome",
          sender: "ai",
          text: "Hello! I am the City Operations Copilot. Ask me to search incidents, isolate priority records, or filter maps categories.",
          timestamp: new Date().toISOString(),
          suggestedCommands: ["Show critical road issues", "Filter to water leakage", "Clear filters"],
        },
      ],
      recommendations: [],
      hotspots: [],
      models: [...initialModels],
      isLoading: false,

      initializeAIStore: () => {
        const currentRecs = get().recommendations;
        if (currentRecs && currentRecs.length > 0) return;
        set({
          recommendations: mockRecommendations,
          hotspots: mockHotspots,
        });
      },

      sendCopilotQuery: async (text) => {
        if (!text.trim()) return;

        const userMsg: CopilotMessage = {
          id: `msg-u-${Math.random().toString(36).substr(2)}`,
          sender: "user",
          text,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          chatHistory: [...state.chatHistory, userMsg],
          isLoading: true,
        }));

        try {
          const aiResponse = await aiRuntime.handleCopilotQuery(text, get().chatHistory);
          
          const aiMsg: CopilotMessage = {
            id: `msg-ai-${Math.random().toString(36).substr(2)}`,
            sender: "ai",
            text: aiResponse.response,
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            chatHistory: [...state.chatHistory, aiMsg],
            isLoading: false,
          }));

          // Execute commands directly if parsed
          if (aiResponse.commandToExecute) {
            const { type, params } = aiResponse.commandToExecute;
            
            if (type === "FILTER_CATEGORY") {
              useGISStore.getState().setActiveHeatmap(null);
              useGISStore.getState().setSearchQuery(params.category);
            } else if (type === "FILTER_PRIORITY") {
              useGISStore.getState().setSearchQuery(params.priority);
            } else if (type === "RESET_VIEW") {
              useGISStore.getState().resetGISStore();
            }
          }
        } catch (err) {
          set({ isLoading: false });
        }
      },

      applyRecommendation: (id) =>
        set((state) => {
          const target = state.recommendations.find((r) => r.id === id);
          if (!target) return state;

          // Apply state actions back to issue store
          if (target.category === "assignment" && target.targetOfficerId) {
            useIssueStore.getState().updateIssue(target.issueId, {
              assignedOfficerId: target.targetOfficerId,
              assignedOfficerName: target.targetOfficerName,
              status: "assigned",
            });
          } else if (target.category === "escalation") {
            useIssueStore.getState().updateIssue(target.issueId, {
              priority: "urgent",
              status: "escalated",
            });
          } else if (target.category === "duplicate") {
            useIssueStore.getState().updateIssue(target.issueId, {
              status: "rejected",
              duplicateGroupId: "dup-group-1",
            });
          }

          return {
            recommendations: state.recommendations.map((r) =>
              r.id === id ? { ...r, status: "applied" } : r
            ),
          };
        }),

      clearChat: () =>
        set({
          chatHistory: [
            {
              id: "welcome",
              sender: "ai",
              text: "Hello! I am the City Operations Copilot. Ask me to search incidents, isolate priority records, or filter maps categories.",
              timestamp: new Date().toISOString(),
              suggestedCommands: ["Show critical road issues", "Filter to water leakage", "Clear filters"],
            },
          ],
        }),
    }),
    {
      name: "community-hero-ai-storage",
      partialize: (state) => ({
        chatHistory: state.chatHistory,
        recommendations: state.recommendations,
      }),
    }
  )
);
