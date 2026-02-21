"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
}

export function AnimatedSection({
  children,
  direction = "up",
  delay = 0,
  className,
}: AnimatedSectionProps) {
  const offsets = {
    up: { x: 0, y: 40 },
    left: { x: -60, y: 0 },
    right: { x: 60, y: 0 },
  };

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
