import { simulateNetwork } from "./base-service";
import { UserProfile, UserRole } from "../types/user-types";

// Seed profiles depending on mock login details
export function getMockUserForEmail(email: string): UserProfile {
  let role: UserRole = "citizen";
  let name = "Ananya Sharma";
  let department: string | undefined;
  let organization: string | undefined;
  
  if (email.startsWith("officer")) {
    role = "officer";
    name = "Aarti Mehra";
    department = "BBMP - Roads & Transit";
  } else if (email.startsWith("manager")) {
    role = "manager";
    name = "Ramesh Kumar";
    department = "BESCOM - Power Infrastructure";
  } else if (email.startsWith("admin")) {
    role = "admin";
    name = "Suresh Murthy";
    department = "Municipal Command Center";
  } else if (email.startsWith("volunteer")) {
    role = "volunteer";
    name = "Vivek Nair";
    organization = "Green Earth Volunteers";
  } else if (email.startsWith("ngo")) {
    role = "ngo";
    name = "Dr. Sana Iqbal";
    organization = "UN-Habitat Civic Action NGO";
  } else {
    role = "citizen";
    // Dynamically derive name from email local-part for personalized hackathon presentations
    const localPart = email.split("@")[0];
    const parts = localPart.split(/[._-]/).filter(Boolean);
    if (parts.length > 0) {
      name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
    } else {
      name = "Ananya Sharma";
    }
  }

  return {
    id: `usr-${role}-${Math.floor(Math.random() * 1000)}`,
    name,
    email,
    phone: "+91 98765 43210",
    avatar: undefined,
    role,
    department,
    organization,
    trustScore: role === "citizen" ? 75 : 92,
    xp: role === "volunteer" ? 2450 : 120,
    achievements: [
      {
        id: "ach-1",
        title: "Platform Pioneer",
        description: "Joined Community Hero AI during the initial rollouts.",
        icon: "award",
        unlockedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
    ],
    preferences: {
      theme: "system",
      language: "en",
      timezone: "Asia/Kolkata",
      reducedMotion: false,
    },
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
      categories: {
        triage: true,
        updates: true,
        rewards: true,
        announcements: false,
      },
    },
    privacySettings: {
      showLocation: true,
      showXP: true,
      anonymousReporting: false,
    },
  };
}

export const authService = {
  /**
   * Exchange a Google ID token (from GIS popup) for an app session.
   * Calls POST /api/auth/google → verifies with google-auth-library → finds/creates user.
   */
  async googleOAuth(credential: string): Promise<{ user: UserProfile }> {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ credential }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Google sign-in failed");
    }
    return res.json();
  },

  async validateSession(): Promise<{ user: UserProfile }> {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      // Include cookies in the request
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Invalid session");
    }
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  },

  async login(email: string, password?: string): Promise<{ user: UserProfile; token: string }> {
    // Check basic email format
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email format");
    }
    
    const user = getMockUserForEmail(email);
    const token = `mock-jwt-token-${Math.random().toString(36).substr(2)}`;
    
    return simulateNetwork({ user, token });
  },

  async register(name: string, email: string, role: UserRole): Promise<{ user: UserProfile; token: string }> {
    if (!name || !email) {
      throw new Error("Name and email are required");
    }
    
    const mockUser: UserProfile = {
      id: `usr-${role}-${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      phone: "+91 98765 43210",
      role,
      trustScore: 50,
      xp: 0,
      achievements: [],
      preferences: { theme: "system", language: "en", timezone: "Asia/Kolkata", reducedMotion: false },
      notificationPreferences: { email: true, push: true, sms: false, categories: { triage: true, updates: true, rewards: true, announcements: false } },
      privacySettings: { showLocation: true, showXP: true, anonymousReporting: false }
    };
    
    const token = `mock-jwt-token-${Math.random().toString(36).substr(2)}`;
    return simulateNetwork({ user: mockUser, token });
  },

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    if (code !== "123456" && code !== "000000") {
      throw new Error("Invalid verification code. Use 123456 or 000000 for test authentication.");
    }
    return simulateNetwork(true);
  },

  async sendOtp(phone: string): Promise<boolean> {
    if (!phone) {
      throw new Error("Phone number is required");
    }
    return simulateNetwork(true);
  },

  async forgotPassword(email: string): Promise<boolean> {
    if (!email) {
      throw new Error("Email is required");
    }
    return simulateNetwork(true);
  },

  async resetPassword(token: string, password?: string): Promise<boolean> {
    if (!token) {
      throw new Error("Reset token is required");
    }
    return simulateNetwork(true);
  }
};
