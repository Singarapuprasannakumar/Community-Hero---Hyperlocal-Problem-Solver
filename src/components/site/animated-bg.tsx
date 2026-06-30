import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-80" />
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <motion.div
        className="absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.22 263 / 0.35), transparent 60%)" }}
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-20 right-0 h-[30rem] w-[30rem] rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.24 295 / 0.32), transparent 60%)" }}
        animate={{ x: [0, -30, 20, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.18 165 / 0.28), transparent 60%)" }}
        animate={{ x: [0, 20, -30, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function FloatingParticles({ count = 14 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const size = 4 + ((i * 7) % 10);
        const left = (i * 53) % 100;
        const top = (i * 37) % 100;
        const dur = 8 + ((i * 3) % 10);
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-primary/40"
            style={{ width: size, height: size, left: `${left}%`, top: `${top}%`, filter: "blur(1px)" }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        );
      })}
    </div>
  );
}