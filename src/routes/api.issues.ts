import { createFileRoute } from "@tanstack/react-router";
import { serverIssuesDb } from "../shared/services/server-db";
import { Issue } from "../shared/types/issue-types";

export const Route = createFileRoute("/api/issues")({
  server: {
    handlers: {
      GET: async () => {
        const issues = await serverIssuesDb.getAll();
        return new Response(JSON.stringify(issues), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        });
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Issue;
          const created = await serverIssuesDb.create(body);
          return new Response(JSON.stringify(created), {
            status: 201,
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (err: any) {
          return new Response(
            JSON.stringify({ error: err.message || "Failed to create issue" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      },
    },
  },
});
