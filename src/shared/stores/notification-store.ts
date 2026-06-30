import { create } from "zustand";
import { AppNotification } from "../types/user-types";

interface NotificationState {
  notifications: AppNotification[];
  isLoading: boolean;
  error: string | null;
  setNotifications: (notifications: AppNotification[]) => void;
  addNotification: (notification: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: "notif-1",
      title: "New duplicate cluster resolved",
      description: "AI triaged and grouped 4 pothole reports in Zone 3 West.",
      category: "triage",
      priority: "medium",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago
    },
    {
      id: "notif-2",
      title: "SLA Warning: Water leakage",
      description: "Ward 42 water supply leakage has 2 hours remaining before SLA breach.",
      category: "updates",
      priority: "high",
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hrs ago
    },
    {
      id: "notif-3",
      title: "Badge unlocked: Super Citizen",
      description: "Congratulations! You have verified 10 community issues this month.",
      category: "rewards",
      priority: "low",
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ],
  isLoading: false,
  error: null,
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));
