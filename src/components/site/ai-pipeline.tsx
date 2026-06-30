import { motion } from "framer-motion";
import { Brain, Layers, Network, Radar, ShieldCheck, Workflow } from "lucide-react";
import { Reveal, staggerContainer } from "@/lib/motion";

const steps = [
  { icon: Radar, step: "Detect", desc: "Vision models locate the incident in the photo and isolate the subject.", grad: "from-blue-500/30 to-indigo-500/30" },
  { icon: Layers, step: "Classify", desc: "Routes into 38 categories — pothole, flood, leak, debris, hazard.", grad: "from-indigo-500/30 to-violet-500/30" },
  { icon: Brain, step: "Score", desc: "Severity, citizen impact and risk-of-harm scoring in milliseconds.", grad: "from-violet-500/30 to-fuchsia-500/30" },
  { icon: Workflow, step: "Match", desc: "Predicts the right department, ETA, and projected resolution cost.", grad: "from-fuchsia-500/30 to-rose-500/30" },
  { icon: Network, step: "Cluster", desc: "Merges duplicate reports within 250 m and a 24 h window automatically.", grad: "from-emerald-500/30 to-teal-500/30" },
  { icon: ShieldCheck, step: "Track", desc: "Closes the loop with citizens transparently from filed to resolved.", grad: "from-teal-500/30 to-cyan-500/30" },
];

export function AIPipeline() {
  return (
    <Reveal variants={staggerContainer(0.08)}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.step}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 shadow-soft backdrop-blur"
            >
              <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${s.grad} blur-2xl transition-opacity group-hover:opacity-100`} />
              <div className="relative flex items-center justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="relative mt-4 text-lg font-semibold tracking-tight">{s.step}</h3>
              <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </Reveal>
  );
}