import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Community Hero AI" },
      { name: "description", content: "We're building the operating system for smart communities, in public, with the operators." },
      { property: "og:title", content: "About — Community Hero AI" },
      { property: "og:description", content: "Our mission, team and the cities we run alongside." },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="About Our Mission"
      title="Empowering citizens, optimizing operations."
      description="Community Hero AI was founded to bridge the gap between community needs and local government response. By utilizing computer vision, intelligent triage, and routing pipelines, we ensure that public issues are resolved transparently, equitably, and efficiently."
    />
  ),
});