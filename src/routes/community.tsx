import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Community Hero AI" },
      { name: "description", content: "Citizens, volunteers, NGOs and departments — together on one transparent platform." },
      { property: "og:title", content: "Community — Community Hero AI" },
      { property: "og:description", content: "The civic platform built around trust and participation." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Community"
      title="Civic infrastructure, in public."
      description="Verification voting, evidence uploads, leaderboards and missions — community features ship next."
    />
  ),
});