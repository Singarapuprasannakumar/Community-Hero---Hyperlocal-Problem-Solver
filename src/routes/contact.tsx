import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/lib/motion";

const CARDS = [
  { icon: Mail, title: "Email", desc: "hello@communityhero.ai" },
  { icon: Phone, title: "Sales", desc: "+91 80 4567 8900" },
  { icon: MessageSquare, title: "Press", desc: "press@communityhero.ai" },
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Community Hero AI" },
      { name: "description", content: "Talk to sales, partnerships and press. We respond within 24 hours, every working day." },
      { property: "og:title", content: "Contact — Community Hero AI" },
      { property: "og:description", content: "Get in touch with the team." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Contact" title="Let's run a pilot together." description="Tell us about your ward, city or department. We'll get back within a working day.">
      <Reveal>
        <div className="grid gap-3 md:grid-cols-3">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded-3xl border border-border bg-card/70 p-7 shadow-soft backdrop-blur">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </Reveal>
    </PageShell>
  ),
});