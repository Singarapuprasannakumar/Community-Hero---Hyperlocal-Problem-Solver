import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Community Hero AI" },
      { name: "description", content: "Case studies, research notes, press kit and engineering blog." },
      { property: "og:title", content: "Resources — Community Hero AI" },
      { property: "og:description", content: "How leading cities run on Community Hero AI." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Resources"
      title="Guides, research, and insights."
      description="Access our comprehensive documentation guides, municipal deployment blueprints, and academic case studies. Our libraries detail how municipal operators leverage AI regression models and spatial geofences to resolve over 90% of local infrastructure issues on-time."
    />
  ),
});