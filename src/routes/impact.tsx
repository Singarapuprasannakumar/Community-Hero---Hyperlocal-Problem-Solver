import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact — Community Hero AI" },
      { name: "description", content: "Real-world outcomes across 14 countries — water saved, trees protected, hours returned to citizens." },
      { property: "og:title", content: "Impact — Community Hero AI" },
      { property: "og:description", content: "Outcomes that show up in the budget." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Impact"
      title="Outcomes that show up in the budget."
      description="Live impact dashboard with carbon, water and time saved across all deployments — coming next."
    />
  ),
});