"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

const sizeMap = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
};

export function Logo({ size = "md", className, animate = true }: LogoProps) {
  return (
    <motion.h1
      className={cn("font-bold text-gradient tracking-wider", sizeMap[size], className)}
      initial={animate ? { opacity: 0, y: -20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      Aura
    </motion.h1>
  );
}
