"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  currentStep: number;
  nickname: string;
  birthday: string;
  gender: string;
  orientation: string;
  relationshipStatus: string;
  consultantVibe: "fox" | "dog" | "owl" | null;
  isComplete: boolean;
  setField: (field: string, value: string) => void;
  setVibe: (vibe: "fox" | "dog" | "owl") => void;
  nextStep: () => void;
  prevStep: () => void;
  complete: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      nickname: "",
      birthday: "",
      gender: "",
      orientation: "",
      relationshipStatus: "",
      consultantVibe: null,
      isComplete: false,
      setField: (field, value) => set({ [field]: value }),
      setVibe: (vibe) => set({ consultantVibe: vibe }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
      complete: () => set({ isComplete: true }),
      reset: () =>
        set({
          currentStep: 1,
          nickname: "",
          birthday: "",
          gender: "",
          orientation: "",
          relationshipStatus: "",
          consultantVibe: null,
          isComplete: false,
        }),
    }),
    { name: "aura-onboarding" }
  )
);
