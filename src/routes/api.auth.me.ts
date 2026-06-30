import { createFileRoute } from "@tanstack/react-router";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../shared/services/db-connection";
import { UserModel } from "../shared/models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "community-hero-dev-secret";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");
          if (!authHeader?.startsWith("Bearer ")) {
            return jsonError("Unauthorized", 401);
          }

          const token = authHeader.split(" ")[1];
          
          let decoded: any;
          try {
            decoded = jwt.verify(token, JWT_SECRET);
          } catch (e) {
            return jsonError("Invalid or expired token", 401);
          }

          if (!decoded?.userId) {
            return jsonError("Invalid token payload", 401);
          }

          await connectToDatabase();
          const user = await UserModel.findById(decoded.userId);

          if (!user) {
            return jsonError("User not found", 404);
          }

          // Return user profile using the exact same mapping as login
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

          return new Response(JSON.stringify({ user: userProfile }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          console.error("[auth/me] Server error:", err.message);
          return jsonError("Server error", 500);
        }
      },
    },
  },
});

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
