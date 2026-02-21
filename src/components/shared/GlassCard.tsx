"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: "purple" | "pink" | "cyan" | "none";
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const glowMap = {
  purple: "shadow-glow-purple",
  pink: "shadow-glow-pink",
  cyan: "shadow-glow-cyan",
  none: "",
};

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function GlassCard({
  className,
  glow = "none",
  hover = false,
  padding = "md",
  children,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass-card",
        paddingMap[padding],
        glowMap[glow],
        className
      )}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
