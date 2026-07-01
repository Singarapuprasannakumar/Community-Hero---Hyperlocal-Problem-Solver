import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../shared/server/auth-server";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { user } = await requireAuth(request);
          return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          console.error("[auth/me] Error:", err.message);
          return jsonError(err.message || "Unauthorized", 401);
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
