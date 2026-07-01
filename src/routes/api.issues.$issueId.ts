import { createFileRoute } from "@tanstack/react-router";
import { serverIssuesDb } from "../shared/services/server-db";
import { requireAuth } from "../shared/server/auth-server";
import { Issue } from "../shared/types/issue-types";

export const Route = createFileRoute("/api/issues/$issueId")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          await requireAuth(request);
          const { issueId } = params;
        const issue = await serverIssuesDb.getById(issueId);
        if (!issue) {
          return new Response(JSON.stringify({ error: "Issue not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(issue), {
          headers: { "Content-Type": "application/json" },
        });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message || "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
      },
      PATCH: async ({ params, request }) => {
        const { issueId } = params;
        try {
          await requireAuth(request);
          const body = (await request.json()) as Partial<Issue>;
          const updated = await serverIssuesDb.update(issueId, body);
          if (!updated) {
            return new Response(JSON.stringify({ error: "Issue not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify(updated), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(
            JSON.stringify({ error: err.message || "Failed to update issue" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
      DELETE: async ({ params, request }) => {
        try {
          await requireAuth(request);
          const { issueId } = params;
        const deleted = await serverIssuesDb.delete(issueId);
        if (!deleted) {
          return new Response(JSON.stringify({ error: "Issue not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message || "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
      },
    },
  },
});
