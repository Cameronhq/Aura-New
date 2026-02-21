"use client";

import { motion } from "motion/react";

interface GradientBackgroundProps {
  variant?: "landing" | "auth" | "dashboard";
}

export function GradientBackground({ variant = "landing" }: GradientBackgroundProps) {
  if (variant === "dashboard") {
    return (
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-void" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-aurora-start/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-glow-cyan/5 blur-[100px]" />
      </div>
    );
  }

  if (variant === "auth") {
    return (
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-void" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-aurora-mid/10 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-void" />
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-aurora-start/10 blur-[120px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-glow-pink/8 blur-[100px]"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-glow-cyan/6 blur-[80px]"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
