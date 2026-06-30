import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Community Hero AI" },
      { name: "description", content: "Every surface a city department, citizen and volunteer needs — designed as a single platform." },
      { property: "og:title", content: "Features — Community Hero AI" },
      { property: "og:description", content: "AI triage, living city map, gamified participation and department analytics." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Features"
      title="Every surface, one platform."
      description="From citizen capture to ward-level dashboards — built like a product, run like infrastructure. Full feature explorer coming next."
    />
  ),
});