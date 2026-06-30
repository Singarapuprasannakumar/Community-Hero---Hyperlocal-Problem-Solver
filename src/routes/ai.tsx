import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { AIPipeline } from "@/components/site/ai-pipeline";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Engine — Community Hero AI" },
      { name: "description", content: "A composable AI pipeline — detection, classification, severity, routing, clustering — under 350 ms end-to-end." },
      { property: "og:title", content: "AI Engine — Community Hero AI" },
      { property: "og:description", content: "From a blurry photo to a dispatched crew, in one pipeline." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="AI Engine"
      title="A pipeline under 350 ms."
      description="Composable, observable, replaceable. Built to scale with your city — not against it."
    >
      <AIPipeline />
    </PageShell>
  ),
});