import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Award, BarChart3, Bell, Brain, Building2, CheckCircle2, Globe2, MapPin, Sparkles, Users2, Zap } from "lucide-react";
import { AnimatedBackground, FloatingParticles } from "@/components/site/animated-bg";
import { Counter } from "@/components/site/counter";
import { MagneticButton } from "@/components/site/magnetic-button";
import { LiveFeed } from "@/components/site/live-feed";
import { AIPipeline } from "@/components/site/ai-pipeline";
import { TestimonialMarquee } from "@/components/site/testimonial-marquee";
import { heroStats, partners } from "@/lib/mock-stats";
import { Reveal, staggerContainer } from "@/lib/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Community Hero AI — The Operating System for Smart Communities" },
      { name: "description", content: "Citizen-powered, AI-triaged. Report community issues, get instant department routing, ETAs and transparent resolution at city scale." },
      { property: "og:title", content: "Community Hero AI — The Operating System for Smart Communities" },
      { property: "og:description", content: "AI that turns citizen reports into measurable urban outcomes." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main>
      <Hero />
      <Partners />
      <ProblemSolution />
      <Features />
      <AISection />
      <ImpactSection />
      <MapPreview />
      <Testimonials />
      <Awards />
      <CTA />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      <AnimatedBackground />
      <FloatingParticles />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Trusted by 312 city departments across 14 countries
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
            >
              The operating system for{" "}
              <span className="text-gradient">smart communities</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground"
            >
              Citizens report. AI triages, predicts and routes. Departments resolve — out in
              the open. From pothole to flood, every report turns into a measurable urban
              outcome.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link to="/dashboard" className="inline-block">
                <MagneticButton>
                  Open dashboard <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </Link>
              <Link to="/ai" className="inline-block">
                <MagneticButton variant="ghost">See the AI engine</MagneticButton>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
            >
              {["WCAG AA", "SOC 2 ready", "GDPR & DPDP", "99.99% uptime"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          <Reveal className="relative" amount={0.1}>
            <HeroVisual />
          </Reveal>
        </div>

        <Reveal className="mt-20" variants={staggerContainer(0.06)}>
          <div className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-card/60 p-4 shadow-card backdrop-blur sm:grid-cols-3 lg:grid-cols-6">
            {heroStats.map((s) => (
              <motion.div
                key={s.label}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className="rounded-2xl px-4 py-3"
              >
                <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  <Counter to={s.value} decimals={"decimals" in s ? s.decimals : 0} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/30 via-fuchsia-500/20 to-emerald-500/20 blur-2xl" />
      <div className="relative rounded-[1.75rem] border border-border bg-card/80 p-4 shadow-card backdrop-blur">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-background/60 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-success" />
            Live incidents · Bengaluru · last 30s
          </div>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>AI triage</span>
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-success">98.4%</span>
            </div>
            <div className="mt-3 flex items-end gap-1.5">
              {[35, 60, 48, 75, 55, 82, 70, 92, 68, 88, 76, 95].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-2.5 rounded-full"
                  style={{ background: "var(--gradient-brand)" }}
                />
              ))}
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground">Avg classification time</div>
            <div className="text-xl font-semibold">
              <Counter to={342} suffix=" ms" />
            </div>
          </div>
          <LiveFeed />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {[
            { icon: Brain, label: "Severity", value: "High" },
            { icon: Building2, label: "Dept", value: "BBMP – Roads" },
            { icon: Zap, label: "ETA", value: "18h" },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" /> {c.label}
                </div>
                <div className="mt-1 text-sm font-medium">{c.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Partners() {
  return (
    <section className="border-y border-border bg-card/30 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Powering smart cities & departments worldwide
        </p>
        <div className="mt-6 grid grid-cols-2 items-center gap-y-4 text-center text-sm font-medium text-muted-foreground sm:grid-cols-4 lg:grid-cols-7">
          {partners.map((p) => (
            <div key={p} className="opacity-70 transition-opacity hover:opacity-100">{p}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  return (
    <section className="mx-auto mt-28 max-w-6xl px-4">
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-3xl border border-border bg-card/60 p-8 shadow-soft">
            <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">The old way</span>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">Reports vanish into inboxes.</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {["Manual triage takes days", "Duplicate complaints clog queues", "No visibility for citizens", "Departments operate in silos", "Outcomes are unmeasured"].map((t) => (
                <li key={t} className="flex items-start gap-2"><span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-destructive" />{t}</li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal>
          <div className="relative rounded-3xl border border-border p-8 shadow-card" style={{ background: "linear-gradient(160deg, color-mix(in oklab, var(--color-primary) 8%, transparent), transparent)" }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">With Community Hero AI</span>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">Closed-loop in hours, not weeks.</h3>
            <ul className="mt-5 space-y-3 text-sm text-foreground/90">
              {["Auto-classified in 342 ms", "Smart duplicate clustering", "Citizens see every status change", "One queue, every department", "Live impact dashboards"].map((t) => (
                <li key={t} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />{t}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: Brain, title: "AI triage in 342 ms", desc: "Vision + language models classify, score and route every incoming report." },
  { icon: MapPin, title: "Living city map", desc: "Heatmaps, clusters, satellite & timeline — issues visualized like Stripe Atlas." },
  { icon: Users2, title: "Community trust", desc: "Verification voting, evidence uploads and reputation keep the signal clean." },
  { icon: BarChart3, title: "Department analytics", desc: "Resolution rate, SLA, citizen sentiment and predicted trends in one cockpit." },
  { icon: Award, title: "Gamified participation", desc: "XP, badges, missions and city leaderboards turn engagement into a habit." },
  { icon: Globe2, title: "Multi-city, multi-tenant", desc: "Run a ward, a district, a state — with full RBAC and audit logs out of the box." },
] as const;

function Features() {
  return (
    <section className="mx-auto mt-28 max-w-6xl px-4">
      <SectionHeading eyebrow="Platform" title="Built like a product. Run like infrastructure." description="Every surface — from the citizen app to the mayor's dashboard — uses the same primitives. Premium, fast, and accessible by default." />
      <Reveal className="mt-12" variants={staggerContainer(0.06)}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card/70 p-7 shadow-soft backdrop-blur"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function AISection() {
  return (
    <section className="mx-auto mt-28 max-w-6xl px-4">
      <SectionHeading eyebrow="AI Engine" title="From a blurry photo to a dispatched crew — in one pipeline." description="A composable pipeline that runs in milliseconds. Every step is observable, auditable and replaceable." />
      <div className="mt-12"><AIPipeline /></div>
    </section>
  );
}

function ImpactSection() {
  const items = [
    { value: 4.2, suffix: "x", label: "Faster resolution vs. legacy 311", decimals: 1 },
    { value: 86, suffix: "%", label: "Citizen satisfaction across pilots", decimals: 0 },
    { value: 12.4, suffix: "M L", label: "Water saved this year", decimals: 1 },
    { value: 84500, suffix: "", label: "Trees protected via early alerts", decimals: 0 },
  ];
  return (
    <section className="mx-auto mt-28 max-w-6xl px-4">
      <SectionHeading eyebrow="Impact" title="Outcomes that show up in the budget." description="Numbers from live deployments across 14 countries — updated nightly." />
      <Reveal className="mt-12" variants={staggerContainer(0.07)}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <motion.div
              key={it.label}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="rounded-3xl border border-border bg-card/70 p-7 shadow-soft backdrop-blur"
            >
              <div className="text-4xl font-semibold tracking-tight">
                <span className="text-gradient">
                  <Counter to={it.value} suffix={it.suffix} decimals={it.decimals} />
                </span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{it.label}</div>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function MapPreview() {
  const pins = [
    { x: "18%", y: "32%", s: "high" as const },
    { x: "32%", y: "58%", s: "med" as const },
    { x: "44%", y: "22%", s: "high" as const },
    { x: "55%", y: "70%", s: "low" as const },
    { x: "62%", y: "44%", s: "med" as const },
    { x: "73%", y: "30%", s: "high" as const },
    { x: "82%", y: "62%", s: "low" as const },
    { x: "28%", y: "78%", s: "high" as const },
  ];
  const dot: Record<string, string> = { high: "bg-destructive", med: "bg-warning", low: "bg-success" };
  return (
    <section className="mx-auto mt-28 max-w-6xl px-4">
      <Reveal>
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card/70 shadow-card">
          <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
            <div className="p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <MapPin className="h-3.5 w-3.5" /> Living city map
              </span>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Every incident, every neighbourhood, in real time.
              </h3>
              <p className="mt-4 text-muted-foreground">
                Clusters that merge intelligently. Heatmaps that surface hotspots. Filters that
                cut across departments — so a ward officer and a citizen see the same truth.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Heatmap", "Satellite", "Clusters", "SLA breach", "Last 24h"].map((c) => (
                  <span key={c} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">{c}</span>
                ))}
              </div>
            </div>
            <div className="relative h-[420px] overflow-hidden border-t border-border bg-secondary/60 lg:border-l lg:border-t-0">
              <div className="absolute inset-0 grid-pattern opacity-60" />
              <div className="absolute inset-0 bg-mesh opacity-60" />
              {pins.map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: p.x, top: p.y }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 220, damping: 18 }}
                >
                  <span className={`relative block h-3 w-3 rounded-full ${dot[p.s]}`}>
                    <span className={`absolute inset-0 animate-ping rounded-full ${dot[p.s]} opacity-60`} />
                  </span>
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="mt-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Loved by operators" title="The people running the city, on the system that runs it." />
      </div>
      <div className="mt-12"><TestimonialMarquee /></div>
    </section>
  );
}

function Awards() {
  const awards = ["Fast Co. Innovation 2025", "GovTech 100", "Awwwards SOTD", "Product Hunt #1", "UN-Habitat Partner", "TIME Tech of 2025"];
  return (
    <section className="mx-auto mt-28 max-w-6xl px-4">
      <Reveal className="rounded-3xl border border-border bg-card/60 p-10 shadow-soft">
        <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/30 to-rose-500/30 text-amber-500">
            <Award className="h-7 w-7" />
          </div>
          <div className="grid grid-cols-2 gap-y-3 text-sm text-muted-foreground sm:grid-cols-3">
            {awards.map((a) => <span key={a} className="font-medium text-foreground/80">{a}</span>)}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto mt-28 max-w-6xl px-4">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-border p-12 text-center shadow-card" style={{ background: "var(--gradient-brand)" }}>
          <div className="absolute inset-0 grid-pattern opacity-25" />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Run your city like a product team.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-white/85">
              Spin up a pilot in a single ward this week. Scale to a metro next quarter.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-foreground shadow-soft transition-transform hover:scale-[1.02]">
                Open dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/10">
                Talk to sales
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      </Reveal>
      {description && (
        <Reveal>
          <p className="mt-4 text-balance text-muted-foreground">{description}</p>
        </Reveal>
      )}
    </div>
  );
}