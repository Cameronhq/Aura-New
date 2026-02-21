"use client";

import { motion } from "motion/react";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { OptionCard } from "./OptionCard";
import { orientationOptions } from "@/data/onboarding-options";
import { GradientButton } from "@/components/shared/GradientButton";

export function OrientationStep() {
  const { orientation, setField, nextStep, prevStep } = useOnboardingStore();

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
          你的性取向是？
        </h1>
        <p className="text-text-secondary text-sm">
          这决定了 AI 如何理解你的择偶偏好。
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {orientationOptions.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            isSelected={orientation === option.value}
            onClick={() => setField("orientation", option.value)}
          />
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <GradientButton onClick={prevStep} variant="secondary" fullWidth>
          上一步
        </GradientButton>
        <GradientButton
          onClick={orientation ? nextStep : undefined}
          fullWidth
          disabled={!orientation}
        >
          下一步
        </GradientButton>
      </div>
    </motion.div>
  );
}
