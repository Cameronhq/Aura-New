"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  emoji?: string;
  description?: string;
  isSelected: boolean;
  onClick: () => void;
  variant?: "default" | "large";
}

export function OptionCard({
  label,
  emoji,
  description,
  isSelected,
  onClick,
  variant = "default",
}: OptionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border transition-all duration-300 cursor-pointer",
        variant === "large" ? "p-5" : "px-4 py-3",
        isSelected
          ? "bg-aurora-start/20 border-aurora-mid/50 shadow-glow-purple"
          : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-3">
        {emoji && <span className="text-xl">{emoji}</span>}
        <div className="flex-1">
          <p
            className={cn(
              "font-medium",
              isSelected ? "text-text-primary" : "text-text-secondary",
              variant === "large" && "text-lg"
            )}
          >
            {label}
          </p>
          {description && (
            <p className="text-text-tertiary text-sm mt-1">{description}</p>
          )}
        </div>
        {isSelected && (
          <motion.div
            className="w-5 h-5 rounded-full bg-aurora-mid flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="text-white text-xs">✓</span>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
