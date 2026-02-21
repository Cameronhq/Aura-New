"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useAuthStore } from "@/stores/authStore";
import { vibeOptions } from "@/data/onboarding-options";
import { GlassCard } from "@/components/shared/GlassCard";
import { GradientButton } from "@/components/shared/GradientButton";
import { cn } from "@/lib/utils";

export function VibeStep() {
  const { consultantVibe, setVibe, prevStep, complete } = useOnboardingStore();
  const { setOnboardingComplete } = useAuthStore();
  const router = useRouter();

  const handleComplete = () => {
    if (!consultantVibe) return;
    complete();
    setOnboardingComplete();
    router.push("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          你需要 Aura 扮演什么角色？
        </h1>
      </div>

      <div className="space-y-4">
        {vibeOptions.map((option) => {
          const isSelected = consultantVibe === option.value;
          return (
            <motion.button
              key={option.value}
              onClick={() => setVibe(option.value as "fox" | "dog" | "owl")}
              className="w-full text-left"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <GlassCard
                glow={isSelected ? "purple" : "none"}
                className={cn(
                  "cursor-pointer transition-all duration-300",
                  isSelected && "border-aurora-mid/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{option.emoji}</span>
                  <div className="flex-1">
                    <p className="text-text-primary font-semibold text-lg">
                      {option.label}
                    </p>
                    <p className="text-text-secondary text-sm mt-1">
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <motion.div
                      className="w-6 h-6 rounded-full bg-aurora-mid flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <span className="text-white text-xs">✓</span>
                    </motion.div>
                  )}
                </div>
              </GlassCard>
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-3 pt-4">
        <GradientButton onClick={prevStep} variant="secondary" fullWidth>
          上一步
        </GradientButton>
        <GradientButton
          onClick={handleComplete}
          fullWidth
          disabled={!consultantVibe}
        >
          开始使用 Aura ✨
        </GradientButton>
      </div>
    </motion.div>
  );
}
