/**
 * POST /api/auth/google
 *
 * Accepts a Google ID token (credential) from the frontend GIS popup,
 * verifies it with google-auth-library, finds or creates the user in
 * MongoDB, then returns a signed app JWT + user profile.
 */
import { createFileRoute } from "@tanstack/react-router";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../shared/services/db-connection";
import { UserModel } from "../shared/models/user.model";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || "";
const JWT_SECRET = process.env.JWT_SECRET || "community-hero-dev-secret";
const JWT_EXPIRES_IN = "7d";

const oauthClient = new OAuth2Client(CLIENT_ID);

export const Route = createFileRoute("/api/auth/google")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // ── 1. Parse body ──────────────────────────────────────────────
        let credential: string;
        try {
          const body = await request.json();
          credential = body?.credential;
          if (!credential) throw new Error("Missing credential");
        } catch {
          return jsonError("Missing or invalid request body", 400);
        }

        // ── 2. Verify Google ID token ──────────────────────────────────
        let payload: {
          sub: string;
          email: string;
          name: string;
          picture?: string;
        };
        try {
          const ticket = await oauthClient.verifyIdToken({
            idToken: credential,
            audience: CLIENT_ID,
          });
          const p = ticket.getPayload();
          if (!p?.sub || !p?.email) throw new Error("Invalid token payload");
          if (!p.email_verified) throw new Error("Email not verified by Google");
          
          payload = {
            sub: p.sub,
            email: p.email,
            name: p.name ?? p.email.split("@")[0],
            picture: p.picture,
          };
        } catch (err: any) {
          console.error("[auth/google] Token verification failed:", err.message);
          return jsonError("Invalid Google token", 401);
        }

        // ── 3. Find or create user in MongoDB ─────────────────────────
        try {
          await connectToDatabase();

          let user = await UserModel.findOne({
            $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }]
          });

          if (user) {
            // Update Google-specific fields if missing
            if (!user.googleId) user.googleId = payload.sub;
            if (!user.picture && payload.picture) user.picture = payload.picture;
            user.lastLogin = new Date();
            await user.save();
          } else {
            // Create new user
            user = await UserModel.create({
              googleId: payload.sub,
              email: payload.email.toLowerCase(),
              name: payload.name,
              picture: payload.picture,
              role: "citizen",
              trustScore: 75,
              xp: 0,
              lastLogin: new Date(),
            });
          }

          // ── 4. Sign app JWT ────────────────────────────────────────────
          const token = jwt.sign(
            { userId: user._id.toString(), email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
          );

          // ── 5. Return user profile ─────────────────────────────────────
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

          return new Response(JSON.stringify({ user: userProfile, token }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          console.error("[auth/google] Database error:", err.message);
          return jsonError("Server error during authentication", 500);
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
