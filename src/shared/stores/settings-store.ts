import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserPreferences, NotificationPreferences, PrivacySettings } from "../types/user-types";

interface SettingsState {
  preferences: UserPreferences;
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  language: "en",
  timezone: "Asia/Kolkata",
  reducedMotion: false,
};

const defaultNotificationPrefs: NotificationPreferences = {
  email: true,
  push: true,
  sms: false,
  categories: {
    triage: true,
    updates: true,
    rewards: true,
    announcements: false,
  },
};

const defaultPrivacySettings: PrivacySettings = {
  showLocation: true,
  showXP: true,
  anonymousReporting: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      notificationPreferences: defaultNotificationPrefs,
      privacySettings: defaultPrivacySettings,
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
      updateNotificationPreferences: (prefs) =>
        set((state) => ({
          notificationPreferences: { ...state.notificationPreferences, ...prefs },
        })),
      updatePrivacySettings: (settings) =>
        set((state) => ({
          privacySettings: { ...state.privacySettings, ...settings },
        })),
    }),
    {
      name: "community-hero-settings-storage",
    }
  )
);
