import { simulateNetwork } from "./base-service";
import { AppNotification } from "../types/user-types";

export const notificationService = {
  async fetchNotifications(userId: string): Promise<AppNotification[]> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    const mockNotifications: AppNotification[] = [
      {
        id: "notif-1",
        title: "New duplicate cluster resolved",
        description: "AI triaged and grouped 4 pothole reports in Zone 3 West.",
        category: "triage",
        priority: "medium",
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "notif-2",
        title: "SLA Warning: Water leakage",
        description: "Ward 42 water supply leakage has 2 hours remaining before SLA breach.",
        category: "updates",
        priority: "high",
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "notif-3",
        title: "Badge unlocked: Super Citizen",
        description: "Congratulations! You have verified 10 community issues this month.",
        category: "rewards",
        priority: "low",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    return simulateNetwork(mockNotifications);
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    return simulateNetwork(true);
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    return simulateNetwork(true);
  },

  async deleteNotification(notificationId: string): Promise<boolean> {
    return simulateNetwork(true);
  }
};
