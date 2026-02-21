"use client";

import { motion } from "motion/react";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { OptionCard } from "./OptionCard";
import { genderOptions } from "@/data/onboarding-options";
import { GradientButton } from "@/components/shared/GradientButton";

export function IdentityStep() {
  const { nickname, birthday, gender, setField, nextStep } = useOnboardingStore();

  const canProceed = nickname && birthday && gender;

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
          建立你的个人档案
        </h1>
      </div>

      <div>
        <label className="block text-text-secondary text-sm mb-2">怎么称呼你？</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setField("nickname", e.target.value)}
          placeholder="你的昵称"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-text-secondary text-sm mb-2">生日</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setField("birthday", e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-aurora-mid/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-text-secondary text-sm mb-3">性别</label>
        <div className="grid grid-cols-2 gap-2">
          {genderOptions.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              isSelected={gender === option.value}
              onClick={() => setField("gender", option.value)}
            />
          ))}
        </div>
      </div>

      <div className="pt-4">
        <GradientButton
          onClick={canProceed ? nextStep : undefined}
          fullWidth
          disabled={!canProceed}
        >
          下一步
        </GradientButton>
      </div>
    </motion.div>
  );
}
