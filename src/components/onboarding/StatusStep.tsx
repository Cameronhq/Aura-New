"use client";

import { motion } from "motion/react";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { OptionCard } from "./OptionCard";
import { statusOptions } from "@/data/onboarding-options";
import { GradientButton } from "@/components/shared/GradientButton";

export function StatusStep() {
  const { relationshipStatus, setField, nextStep, prevStep } = useOnboardingStore();

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
          你当下的情感状态是？
        </h1>
        <p className="text-text-secondary text-sm">
          Aura 会根据你的状态切换不同的战术模式。
        </p>
      </div>

      <div className="space-y-3">
        {statusOptions.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            emoji={option.emoji}
            description={option.description}
            isSelected={relationshipStatus === option.value}
            onClick={() => setField("relationshipStatus", option.value)}
            variant="large"
          />
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <GradientButton onClick={prevStep} variant="secondary" fullWidth>
          上一步
        </GradientButton>
        <GradientButton
          onClick={relationshipStatus ? nextStep : undefined}
          fullWidth
          disabled={!relationshipStatus}
        >
          下一步
        </GradientButton>
      </div>
    </motion.div>
  );
}
