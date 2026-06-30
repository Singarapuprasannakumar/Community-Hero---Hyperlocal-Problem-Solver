import { motion } from "framer-motion";
import { testimonials } from "@/lib/mock-stats";

export function TestimonialMarquee() {
  const row = [...testimonials, ...testimonials];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="flex w-max gap-4"
      >
        {row.map((t, i) => (
          <figure
            key={i}
            className="w-[22rem] shrink-0 rounded-3xl border border-border bg-card/70 p-6 shadow-soft backdrop-blur"
          >
            <blockquote className="text-[15px] leading-relaxed text-foreground/90">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </motion.div>
    </div>
  );
}