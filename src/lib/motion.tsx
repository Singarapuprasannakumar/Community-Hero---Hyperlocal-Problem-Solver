import { motion, type MotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const easeOut = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easeOut } },
};

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export function Reveal({
  children,
  className,
  variants = fadeUp,
  amount = 0.25,
  once = true,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  amount?: number;
  once?: boolean;
} & MotionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}