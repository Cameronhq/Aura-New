import type { Variants, Transition } from "motion/react";

export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

export const gentleFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: smoothSpring },
};

export const glowPulse: Variants = {
  idle: { boxShadow: "0 0 20px rgba(124,58,237,0.2)" },
  glow: {
    boxShadow: "0 0 60px rgba(124,58,237,0.5)",
    transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" },
  },
};
