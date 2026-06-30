import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/lib/motion";

type Tier = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  featured?: boolean;
};

const TIERS: Tier[] = [
  { name: "Ward", price: "Free", desc: "Pilot a single ward.", features: ["Up to 5 staff seats", "1,000 reports / month", "AI triage", "Public dashboard"] },
  { name: "City", price: "Custom", desc: "Scale to a metro.", features: ["Unlimited seats", "Unlimited reports", "Department analytics", "SSO + audit logs"], featured: true },
  { name: "Enterprise", price: "Talk to us", desc: "State & national rollouts.", features: ["Dedicated region", "On-prem option", "99.99% SLA", "24/7 support"] },
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Community Hero AI" },
      { name: "description", content: "Start with a ward for free. Scale to a metro, a state, a country — pricing tuned to public-sector procurement." },
      { property: "og:title", content: "Pricing — Community Hero AI" },
      { property: "og:description", content: "From a single ward to national rollouts." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Pricing" title="Built for public-sector procurement." description="Start with one ward for free. Expand at your pace — no per-citizen lock-in.">
      <Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl border p-7 shadow-soft backdrop-blur ${
                t.featured ? "border-primary bg-card shadow-glow" : "border-border bg-card/70"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: "var(--gradient-brand)" }}>
                  Most cities pick this
                </span>
              )}
              <h3 className="text-lg font-semibold tracking-tight">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-5 text-3xl font-semibold tracking-tight">{t.price}</div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-success" />{f}</li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  t.featured ? "text-white shadow-glow" : "border border-border bg-background hover:bg-secondary"
                }`}
                style={t.featured ? { background: "var(--gradient-brand)" } : undefined}
              >
                Talk to sales
              </Link>
            </div>
          ))}
        </div>
      </Reveal>
    </PageShell>
  ),
});