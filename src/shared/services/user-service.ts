import { simulateNetwork } from "./base-service";
import { UserProfile, UserAchievement } from "../types/user-types";

export const userService = {
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    // In a real application we would submit updates to the database
    // Here we simulate updating the payload
    return simulateNetwork({
      id: userId,
      ...updates,
    } as UserProfile);
  },

  async fetchAchievements(userId: string): Promise<UserAchievement[]> {
    const mockAchievements: UserAchievement[] = [
      {
        id: "ach-1",
        title: "Platform Pioneer",
        description: "Joined Community Hero AI during the initial rollouts.",
        icon: "award",
        unlockedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: "ach-2",
        title: "Pothole Patrol",
        description: "Successfully identified and reported 5 pothole incidents.",
        icon: "shield-alert",
        unlockedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        id: "ach-3",
        title: "Eco Guardian",
        description: "Volunteered for 3 public green preservation initiatives.",
        icon: "leaf",
        unlockedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      }
    ];

    return simulateNetwork(mockAchievements);
  }
};
