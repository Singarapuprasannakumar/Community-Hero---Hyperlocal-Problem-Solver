import { getCookie } from "@tanstack/react-start/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../services/db-connection";
import { UserModel } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "community-hero-dev-secret";

// 1. Helper to parse cookies from standard Request headers (for API routes)
export function parseCookies(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return {};
  
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const parts = c.trim().split("=");
      return [parts[0], parts.slice(1).join("=")];
    })
  );
}

// 2. Middleware helper for API routes (returns authenticated user or throws)
export async function requireAuth(request: Request) {
  // First try extracting from cookies
  const cookies = parseCookies(request);
  let token = cookies["auth_token"];
  
  // Fallback to Authorization header
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    throw new Error("Unauthorized: Missing token");
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    throw new Error("Unauthorized: Invalid or expired token");
  }

  if (!decoded?.userId) {
    throw new Error("Unauthorized: Invalid token payload");
  }

  await connectToDatabase();
  const user = await UserModel.findById(decoded.userId).lean();

  if (!user) {
    throw new Error("Unauthorized: User not found");
  }

  // Format user profile
  const userProfile = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: "",
    avatar: user.picture,
    role: user.role,
    department: user.department,
    organization: user.organization,
    trustScore: user.trustScore,
    xp: user.xp,
    achievements: [],
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
      categories: { triage: true, updates: true, rewards: true, announcements: false },
    },
    privacySettings: { showLocation: true, showXP: true, anonymousReporting: false },
  };

  return { user: userProfile, token };
}

export async function getSessionProfile(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded?.userId) return null;

    await connectToDatabase();
    const user = await UserModel.findById(decoded.userId).lean();
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: "",
      avatar: user.picture,
      role: user.role,
      department: user.department,
      organization: user.organization,
      trustScore: user.trustScore,
      xp: user.xp,
      achievements: [],
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
        categories: { triage: true, updates: true, rewards: true, announcements: false },
      },
      privacySettings: { showLocation: true, showXP: true, anonymousReporting: false },
    };
  } catch (err) {
    return null;
  }
}
