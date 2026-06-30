import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/lib/motion";
import { AnimatedBackground } from "./animated-bg";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <main className="relative">
      <section className="relative overflow-hidden pt-36 pb-20">
        <AnimatedBackground />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          {eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              {eyebrow}
            </motion.span>
          )}
          <Reveal>
            <h1 className="mt-5 text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
              {title}
            </h1>
          </Reveal>
          <Reveal>
            <p className="mt-5 text-balance text-lg text-muted-foreground">{description}</p>
          </Reveal>
        </div>
      </section>
      {children && <section className="mx-auto max-w-6xl px-4 pb-24">{children}</section>}
    </main>
  );
}