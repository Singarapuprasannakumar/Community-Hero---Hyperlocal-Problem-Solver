export type UserRole =
  | "citizen"
  | "volunteer"
  | "ngo"
  | "officer"
  | "manager"
  | "admin";

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  reducedMotion: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    triage: boolean;
    updates: boolean;
    rewards: boolean;
    announcements: boolean;
  };
}

export interface PrivacySettings {
  showLocation: boolean;
  showXP: boolean;
  anonymousReporting: boolean;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  organization?: string;
  trustScore: number; // 0 to 100
  xp: number;
  achievements: UserAchievement[];
  preferences: UserPreferences;
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
}

export interface WorkspaceInfo {
  id: string;
  name: string;
  region: string;
  role: UserRole;
  isActive: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  category: "triage" | "updates" | "rewards" | "announcements";
  priority: "low" | "medium" | "high";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
