"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center gap-3">
            <motion.div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                isActive && "bg-aurora-start text-white",
                isCompleted && "bg-aurora-start/40 text-white",
                !isActive && !isCompleted && "bg-white/10 text-text-tertiary"
              )}
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isCompleted ? "✓" : step}
            </motion.div>
            {step < totalSteps && (
              <div
                className={cn(
                  "w-8 h-0.5 rounded-full",
                  isCompleted ? "bg-aurora-start/40" : "bg-white/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
