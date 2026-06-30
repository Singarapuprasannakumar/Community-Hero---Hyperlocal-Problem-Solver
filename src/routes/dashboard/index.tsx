import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, Building2, CheckCircle2, MapPin, Users2 } from "lucide-react";
import { Counter } from "@/components/site/counter";
import { Reveal, staggerContainer } from "@/lib/motion";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useIssueStore } from "@/shared/stores/issue-store";
import { AIRecommendationsWidget, AIModelLatencyWidget } from "@/features/ai/components/ai-widgets";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Overview — Community Hero AI" },
    ],
  }),
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  const { user } = useAuthStore();
  const { issues, initializeDatabase } = useIssueStore();

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  // Dynamic calculations from the 500+ issues store
  const openIssues = issues.filter(
    (i) => i.status !== "resolved" && i.status !== "closed" && i.status !== "cancelled"
  ).length;

  const urgentIssues = issues.filter(
    (i) => i.priority === "urgent" && i.status !== "resolved" && i.status !== "closed"
  ).length;

  const resolvedIssues = issues.filter(
    (i) => i.status === "resolved" || i.status === "closed"
  ).length;

  // Department success metric calculation
  const getDeptPerformance = (categoryName: string) => {
    const deptIssues = issues.filter((i) => i.category === categoryName);
    if (deptIssues.length === 0) return 100;
    const resolved = deptIssues.filter((i) => i.status === "resolved" || i.status === "closed").length;
    return Math.round((resolved / deptIssues.length) * 100);
  };

  const KPIS = [
    { icon: Activity, label: "Open issues", value: openIssues, tone: "from-blue-500/30 to-indigo-500/30" },
    { icon: AlertTriangle, label: "SLA at risk", value: urgentIssues, tone: "from-rose-500/30 to-amber-500/30" },
    { icon: CheckCircle2, label: "Resolved issues", value: resolvedIssues, tone: "from-emerald-500/30 to-teal-500/30" },
    { icon: Users2, label: "Active citizens", value: 1240000, tone: "from-violet-500/30 to-fuchsia-500/30" },
  ];

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" /> Live · Bengaluru control room
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Good morning, <span className="text-gradient">{user?.name.split(" ")[0] || "Aarti"}</span>.
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">Here's what your wards look like right now.</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium hover:bg-secondary">Today</button>
            <button className="rounded-xl px-3.5 py-2 text-xs font-medium text-white shadow-glow" style={{ background: "var(--gradient-brand)" }}>
              Export
            </button>
          </div>
        </div>
      </Reveal>

      {/* Dynamic KPIs Grid */}
      <Reveal className="mt-6" variants={staggerContainer(0.06)}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k) => {
            const Icon = k.icon;
            return (
              <motion.div
                key={k.label}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card/75 p-6 shadow-soft"
              >
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${k.tone} blur-2xl`} />
                <div className="relative flex items-center justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="relative mt-5 text-3xl font-semibold tracking-tight">
                  <Counter to={k.value} />
                </div>
                <div className="relative mt-1 text-sm text-muted-foreground">{k.label}</div>
              </motion.div>
            );
          })}
        </div>
      </Reveal>

      {/* Dynamic charts and list metrics */}
      <Reveal className="mt-6">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* Mock charts */}
          <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-soft backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Issue volume — last 14 days</h2>
              <span className="text-xs text-muted-foreground">vs. previous fortnight</span>
            </div>
            <div className="mt-6 flex h-56 items-end gap-2">
              {[42, 58, 51, 68, 60, 75, 82, 70, 88, 95, 80, 92, 100, 96].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 rounded-t-lg"
                  style={{ background: "var(--gradient-brand)" }}
                />
              ))}
            </div>
          </div>

          {/* Department Performance Panel */}
          <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-soft backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Department performance</h2>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <ul className="mt-6 space-y-4">
              {[
                { name: "Roads & Transit", dept: "BBMP - Roads" },
                { name: "Water Supply", dept: "BWSSB - Water Operations" },
                { name: "Sanitation", dept: "BBMP - Waste Management" },
                { name: "Parks & Trees", dept: "BBMP - Forest Department" },
                { name: "Hazards & Safety", dept: "BESCOM - Power Grid" },
              ].map((d) => {
                const perf = getDeptPerformance(d.name);
                return (
                  <li key={d.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {d.name}
                      </span>
                      <span className="font-semibold">{perf}% resolved</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${perf}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ background: "var(--gradient-brand)" }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* AI Intelligence Row */}
      <Reveal className="mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <AIRecommendationsWidget />
          <AIModelLatencyWidget />
        </div>
      </Reveal>
    </div>
  );
}
