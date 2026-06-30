import { simulateNetwork } from "./base-service";
import { useVolunteerStore } from "../stores/community-store";

export const volunteerService = {
  async getSuggestedVolunteers(issueCategory: string) {
    const { volunteers } = useVolunteerStore.getState();
    
    // Filter volunteers matching skills or preferred categories
    const matches = volunteers.filter((vol) =>
      vol.preferredCategories.includes(issueCategory) || 
      vol.skills.includes("Road clearing")
    );

    return simulateNetwork(
      matches.map((vol) => ({
        id: vol.id,
        name: vol.name,
        matchConfidence: 0.85 + Math.random() * 0.12, // 85% to 97%
        skills: vol.skills,
        proximityKm: parseFloat((Math.random() * 2.5 + 0.3).toFixed(1)), // 0.3km to 2.8km
        hoursServed: vol.volunteerHours,
      }))
    );
  }
};

export const verificationService = {
  async processEvidenceConsensus(issueId: string, trustScore: number) {
    // Computes consensus weight based on verifying user's trust rating
    const weight = trustScore >= 90 ? "high" : trustScore >= 75 ? "medium" : "low";
    const consensusReached = trustScore > 50;

    return simulateNetwork({
      status: consensusReached ? "verified" : "pending_verification",
      consensusWeight: weight,
      consensusProbability: parseFloat((Math.random() * 0.1 + 0.86).toFixed(2)), // 86% to 96%
    });
  }
};

export const campaignService = {
  async getCampaignProgress(campaignId: string) {
    return simulateNetwork({
      participantsCount: 42,
      impactMetric: "350kg trash collected",
      progress: 68,
      status: "active",
    });
  }
};
