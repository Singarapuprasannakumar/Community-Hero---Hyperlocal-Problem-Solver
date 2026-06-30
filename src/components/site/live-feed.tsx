import { motion } from "framer-motion";
import { liveFeed } from "@/lib/mock-stats";
import { cn } from "@/lib/utils";

const dot: Record<string, string> = {
  high: "bg-destructive",
  med: "bg-warning",
  low: "bg-success",
};

export function LiveFeed() {
  const items = [...liveFeed, ...liveFeed];
  return (
    <div className="relative h-72 overflow-hidden rounded-3xl border border-border bg-card/60 p-4 shadow-card">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-card to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-card to-transparent" />
      <motion.ul
        animate={{ y: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="space-y-2"
      >
        {items.map((it, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/50 px-3 py-2.5 text-sm backdrop-blur"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className={cn("inline-block h-2 w-2 shrink-0 rounded-full", dot[it.severity])} />
              <span className="truncate font-medium">{it.issue}</span>
            </div>
            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {it.city}
            </span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}